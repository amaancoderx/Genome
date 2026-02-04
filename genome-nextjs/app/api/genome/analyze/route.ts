import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateJSON } from '@/lib/together'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandInput } = await req.json()

    if (!brandInput) {
      return NextResponse.json(
        { error: 'Brand input is required' },
        { status: 400 }
      )
    }

    // Analyze Brand DNA
    const brandDnaPrompt = `Analyze this brand and extract its DNA: "${brandInput}"

Provide a comprehensive brand DNA analysis covering:
1. BRAND PERSONALITY - Tone & Voice, Core Values, Brand Archetype
2. POSITIONING - Market Position, Unique Value Proposition, Differentiation Strategy
3. TARGET AUDIENCE - Primary Demographics, Psychographics, Pain Points Addressed
4. VISUAL IDENTITY - Color Psychology, Design Language, Brand Aesthetics
5. MESSAGING STRATEGY - Key Messages, Communication Style, Emotional Appeal

Return as JSON with these exact keys:
{
  "personality": {"tone": "", "values": [], "archetype": ""},
  "positioning": {"market_position": "", "uvp": "", "differentiation": ""},
  "audience": {"demographics": "", "psychographics": "", "pain_points": []},
  "visual": {"colors": [], "design_language": "", "aesthetics": ""},
  "messaging": {"key_messages": [], "style": "", "emotional_appeal": ""}
}`

    const brandDna = await generateJSON(brandDnaPrompt)

    // Analyze Competitors
    const competitorPrompt = `Based on this brand analysis, identify REAL competitors and their weaknesses:

Brand: ${brandInput}
Positioning: ${brandDna.positioning?.market_position || 'N/A'}

IMPORTANT: You MUST provide REAL, ACTUAL company/brand names that exist in the market. Do NOT use placeholder names like "BrandX", "BrandY", "CompetitorA" etc.

For example:
- If analyzing a sportswear brand, competitors might be: Nike, Adidas, Puma, Under Armour
- If analyzing a tech company, competitors might be: Apple, Google, Microsoft, Samsung
- If analyzing a coffee brand, competitors might be: Starbucks, Dunkin, Peet's Coffee

Provide:
1. Top 4 REAL direct competitors with their ACTUAL brand names and specific weaknesses
2. Market gaps/opportunities in this industry
3. Competitive advantages to leverage

Return as JSON:
{
  "competitors": [{"name": "Real Brand Name", "weakness": "Specific weakness", "market_share": "estimated %"}],
  "market_gaps": ["Specific gap 1", "Specific gap 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "competitive_advantages": ["Advantage 1", "Advantage 2"]
}`

    const competitors = await generateJSON(competitorPrompt)

    // Create Growth Roadmap
    const roadmapPrompt = `Create a 90-day growth roadmap for this brand:

Brand DNA:
${JSON.stringify(brandDna, null, 2)}

Market Opportunities:
${JSON.stringify(competitors.opportunities || [], null, 2)}

Return JSON with this EXACT structure:
{
  "month_1": {
    "title": "Quick Wins",
    "priorities": ["Priority 1", "Priority 2", "Priority 3"]
  },
  "month_2": {
    "title": "Momentum Building",
    "priorities": ["Priority 1", "Priority 2", "Priority 3"]
  },
  "month_3": {
    "title": "Scaling",
    "priorities": ["Priority 1", "Priority 2", "Priority 3"]
  },
  "key_metrics": ["Metric 1", "Metric 2"],
  "resources": ["Resource 1", "Resource 2"]
}`

    const growthRoadmap = await generateJSON(roadmapPrompt)

    // Create Content Strategy
    const contentPrompt = `Create a content strategy framework for this brand:

Brand DNA:
Tone: ${brandDna.personality?.tone || 'Professional'}
Values: ${(brandDna.personality?.values || []).join(', ')}
Target Audience: ${brandDna.audience?.demographics || 'N/A'}

Return JSON with this EXACT structure:
{
  "content_pillars": [
    {"name": "Pillar Name 1", "description": "Description of this content pillar"},
    {"name": "Pillar Name 2", "description": "Description of this content pillar"},
    {"name": "Pillar Name 3", "description": "Description of this content pillar"}
  ],
  "content_formats": ["Blog posts", "Videos", "Social media"],
  "posting_frequency": {
    "instagram": "3-4 times per week",
    "twitter": "Daily",
    "blog": "2 times per week"
  },
  "platform_strategies": [
    {"platform": "Instagram", "strategy": "Strategy description"},
    {"platform": "Twitter", "strategy": "Strategy description"}
  ]
}`

    const contentStrategy = await generateJSON(contentPrompt)

    // Save report to Supabase
    const { error: saveError } = await supabaseAdmin.from('genome_reports').insert({
      user_id: userId,
      brand_input: brandInput,
      brand_dna: brandDna,
      competitors: competitors,
      growth_roadmap: growthRoadmap,
      content_strategy: contentStrategy,
      status: 'completed',
    })

    if (saveError) {
      console.error('Error saving genome report:', saveError)
    }

    return NextResponse.json({
      brandDna,
      competitors,
      growthRoadmap,
      contentStrategy,
      pdfUrl: null,
    })
  } catch (error) {
    console.error('Genome analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze brand' },
      { status: 500 }
    )
  }
}
