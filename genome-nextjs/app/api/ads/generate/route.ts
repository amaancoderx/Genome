import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateJSON, generateImage } from '@/lib/together'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyword, companyName, businessDescription } = await req.json()

    if (!keyword || !companyName) {
      return NextResponse.json(
        { error: 'Keyword and company name are required' },
        { status: 400 }
      )
    }

    // Generate discovered ads using OpenAI
    const discoveredAdsPrompt = `Generate 3 realistic competitor ad examples for the keyword "${keyword}".

For each ad, provide:
- Brand name (realistic competitor in this niche)
- Days running (7-90)
- Relevance score (6-10)
- Ad copy analysis

Return JSON:
{
  "ads": [
    {
      "brandName": "Competitor Name",
      "daysRunning": 45,
      "relevanceScore": 8,
      "adAnalysis": "Description of ad style and messaging"
    }
  ]
}`

    const discoveredAds = await generateJSON(discoveredAdsPrompt)

    // Generate variations for each discovered ad using OpenAI
    const adsWithVariations = await Promise.all(
      (discoveredAds.ads || []).slice(0, 3).map(async (ad: {
        brandName: string
        daysRunning: number
        relevanceScore: number
        adAnalysis: string
      }, index: number) => {
        // Generate ad copy variations using OpenAI
        const variationsPrompt = `Create 3 ad variations for ${companyName} based on competitor analysis.

Competitor: ${ad.brandName}
Keyword: ${keyword}
Business: ${businessDescription || companyName}

For each variation, provide different creative angles:
1. Emotional/Story-based
2. Benefit-focused/Direct
3. Social proof/Authority

Return JSON:
{
  "variations": [
    {
      "variationName": "Version 1 - Emotional",
      "creativeDirection": "Why this approach works",
      "adCopy": {
        "headline": "5-10 word headline",
        "primaryText": "125 char body copy",
        "description": "30 word description",
        "ctaButton": "Learn More"
      },
      "imagePrompt": "Detailed prompt for generating ad image"
    }
  ]
}`

        const variations = await generateJSON(variationsPrompt)

        // Generate images for variations using OpenAI DALL-E 3
        const variationsWithImages = await Promise.all(
          (variations.variations || []).slice(0, 3).map(async (variation: {
            variationName: string
            creativeDirection: string
            adCopy: {
              headline: string
              primaryText: string
              description: string
              ctaButton: string
            }
            imagePrompt?: string
          }, vIndex: number) => {
            // Only generate image for first variation to save API calls
            let imageUrl = null
            if (vIndex === 0) {
              const imagePrompt = variation.imagePrompt ||
                `Professional Facebook/Instagram ad design for ${companyName}. ${keyword} business. Clean modern design with text: "${variation.adCopy.headline}". Professional marketing ad, high quality.`
              imageUrl = await generateImage(imagePrompt)
            }

            return {
              ...variation,
              imageUrl,
            }
          })
        )

        return {
          id: `ad-${index}`,
          brandName: ad.brandName,
          daysRunning: ad.daysRunning,
          relevanceScore: ad.relevanceScore,
          imageUrl: null,
          variations: variationsWithImages,
        }
      })
    )

    // Save ad generation to Supabase
    const { error: saveError } = await supabaseAdmin.from('ad_generations').insert({
      user_id: userId,
      keyword,
      company_name: companyName,
      business_description: businessDescription || null,
      status: 'completed',
      results: { ads: adsWithVariations },
    })

    if (saveError) {
      console.error('Error saving ad generation:', saveError)
    }

    return NextResponse.json({
      keyword,
      totalAdsFound: 50,
      relevantAds: adsWithVariations.length,
      ads: adsWithVariations,
      pdfUrl: null,
    })
  } catch (error: unknown) {
    console.error('Ad generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate ads'

    // Check for rate limit errors
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
