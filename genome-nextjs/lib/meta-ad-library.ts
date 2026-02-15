/**
 * Meta Ad Library Integration
 * Fetches real competitor ads from Facebook/Meta Ad Library API
 *
 * Uses the public Meta Ad Library API to search for active ads
 * from real competitor brands and retrieve their creative images.
 *
 * Fallback: If no Meta access token is configured, uses Google Custom Search
 * or returns null so the system can fall back to AI-generated representations.
 */

interface MetaAd {
  id: string
  ad_snapshot_url: string
  page_name: string
  ad_creative_bodies?: string[]
  ad_creative_link_titles?: string[]
}

interface CompetitorAdResult {
  imageUrl: string | null
  imageBase64: string | null
  brandName: string
  adCopy: string
  source: 'meta_ad_library' | 'google_search' | 'ai_generated'
}

/**
 * Fetch real ads from Meta Ad Library API
 */
async function fetchFromMetaAdLibrary(
  brandName: string,
  country: string = 'ALL'
): Promise<CompetitorAdResult | null> {
  const accessToken = process.env.META_AD_LIBRARY_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN

  if (!accessToken) {
    return null
  }

  try {
    const params = new URLSearchParams({
      search_terms: brandName,
      ad_type: 'ALL',
      ad_reached_countries: JSON.stringify([country === 'ALL' ? 'US' : country]),
      fields: 'id,ad_snapshot_url,page_name,ad_creative_bodies,ad_creative_link_titles',
      limit: '5',
      access_token: accessToken,
    })

    const response = await fetch(
      `https://graph.facebook.com/v21.0/ads_archive?${params.toString()}`
    )

    if (!response.ok) {
      console.error('Meta Ad Library API error:', response.status)
      return null
    }

    const data = await response.json()
    const ads: MetaAd[] = data?.data || []

    if (ads.length === 0) return null

    // Pick a random ad from the results for variety
    const ad = ads[Math.floor(Math.random() * Math.min(ads.length, 5))]

    // The ad_snapshot_url is a URL to view the ad - we need to get the image from it
    // For now, return the snapshot URL and description
    const adCopy = ad.ad_creative_bodies?.[0] || ad.ad_creative_link_titles?.[0] || ''

    return {
      imageUrl: ad.ad_snapshot_url,
      imageBase64: null,
      brandName: ad.page_name || brandName,
      adCopy,
      source: 'meta_ad_library',
    }
  } catch (error) {
    console.error('Meta Ad Library fetch error:', error)
    return null
  }
}

/**
 * Search Google for competitor ad screenshots/images
 * Uses Google Custom Search API if configured
 */
async function fetchFromGoogleSearch(
  brandName: string,
  productCategory: string
): Promise<CompetitorAdResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!apiKey || !searchEngineId) {
    return null
  }

  try {
    const query = `${brandName} Instagram ad ${productCategory}`
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      searchType: 'image',
      num: '3',
      imgSize: 'large',
      safe: 'active',
    })

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?${params.toString()}`
    )

    if (!response.ok) return null

    const data = await response.json()
    const items = data?.items || []

    if (items.length === 0) return null

    const item = items[0]

    // Fetch the image and convert to base64
    const imageBase64 = await fetchImageToBase64(item.link)

    return {
      imageUrl: item.link,
      imageBase64,
      brandName,
      adCopy: item.title || '',
      source: 'google_search',
    }
  } catch (error) {
    console.error('Google search error:', error)
    return null
  }
}

/**
 * Fetch an image URL and convert to base64 data URI
 * Works on server-side (Node.js) - no CORS issues
 */
export async function fetchImageToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GenomeAI/1.0)',
      },
    })

    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'image/png'
    const base64 = buffer.toString('base64')

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('Image fetch error:', error)
    return null
  }
}

/**
 * Main function: Try to get a real competitor ad image
 * Falls through multiple sources before giving up
 */
export async function getCompetitorAdImage(
  brandName: string,
  productCategory: string
): Promise<CompetitorAdResult> {
  // Try Meta Ad Library first
  const metaResult = await fetchFromMetaAdLibrary(brandName)
  if (metaResult?.imageUrl) {
    // Convert the ad snapshot to base64 if possible
    const base64 = await fetchImageToBase64(metaResult.imageUrl)
    if (base64) {
      return { ...metaResult, imageBase64: base64 }
    }
    return metaResult
  }

  // Try Google Image Search
  const googleResult = await fetchFromGoogleSearch(brandName, productCategory)
  if (googleResult?.imageBase64) {
    return googleResult
  }

  // Return null - caller should fall back to AI generation
  return {
    imageUrl: null,
    imageBase64: null,
    brandName,
    adCopy: '',
    source: 'ai_generated',
  }
}
