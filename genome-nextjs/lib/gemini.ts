import { GoogleGenerativeAI } from '@google/generative-ai'

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function generateAdVariations(
  keyword: string,
  companyName: string,
  businessDescription: string,
  adAnalysis: string
) {
  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Create 3 ad variations for ${companyName} based on competitor analysis.

Keyword: ${keyword}
Business: ${businessDescription || companyName}
Competitor Ad Analysis: ${adAnalysis}

For each variation, provide different creative angles:
1. Emotional/Story-based
2. Benefit-focused/Direct
3. Social proof/Authority

Return ONLY valid JSON (no markdown):
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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return JSON.parse(text)
  } catch (error) {
    console.error('Gemini ad variation error:', error)
    throw error
  }
}

export async function analyzeAdRelevance(
  keyword: string,
  userPrompt: string
) {
  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Analyze ad relevance for the following criteria:

TARGET KEYWORD: "${keyword}"
USER'S BUSINESS: "${userPrompt}"

Determine if ads in this niche would be worth using as inspiration.

Return ONLY valid JSON:
{
  "is_relevant": true,
  "relevance_score": 8,
  "reasoning": "Brief explanation",
  "design_quality": "good",
  "recommended_for_generation": true
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return JSON.parse(text)
  } catch (error) {
    console.error('Gemini relevance analysis error:', error)
    throw error
  }
}

export async function generateDiscoveredAds(keyword: string) {
  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Generate 3 realistic competitor ad examples for the keyword "${keyword}".

For each ad, provide:
- Brand name (realistic competitor in this niche)
- Days running (7-90)
- Relevance score (6-10)
- Ad copy analysis

Return ONLY valid JSON:
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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return JSON.parse(text)
  } catch (error) {
    console.error('Gemini discovered ads error:', error)
    throw error
  }
}

export { genai }
