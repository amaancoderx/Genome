import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openai, generateImage } from '@/lib/together'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchImageToBase64 } from '@/lib/meta-ad-library'

interface CreativeReference {
  title: string
  description: string
  imageBase64: string | null
  style: string
  platform: string
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyName, productDescription, targetAudience, competitorCount } = await req.json()

    if (!companyName || !productDescription) {
      return NextResponse.json(
        { error: 'Company name and product description are required' },
        { status: 400 }
      )
    }

    const numCompetitors = Math.min(Math.max(competitorCount || 3, 1), 5)
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const systemPrompt = `You are an elite enterprise-level AI marketing strategist, Instagram ad intelligence analyst, and performance marketing consultant.

Generate a complete professional marketing intelligence report in rich Markdown format.

RULES:
- Output MUST be clean, structured, professional report text in Markdown.
- Do NOT output JSON.
- Do NOT explain your reasoning.
- Do NOT include commentary outside the report.
- Use clear section headings with proper Markdown hierarchy.
- Keep tone executive-level and strategic.
- No emojis.
- Use REAL brand names for competitors - never use placeholders like "BrandX" or "CompetitorA".
- Be specific with data, percentages, and actionable recommendations.
- Use bullet points, bold text, and tables where appropriate.`

    const userMessage = `Generate a comprehensive Ad Intelligence Report for:

**Company**: ${companyName}
**Product/Service**: ${productDescription}
${targetAudience ? `**Target Audience**: ${targetAudience}` : '**Target Audience**: General market audience'}
**Number of Competitors to Analyze**: ${numCompetitors}
**Report Date**: ${today}

Generate the report with this EXACT structure:

# Genome Ad Intelligence Report
**Brand:** ${companyName}
**Date:** ${today}

---

## 1. Executive Overview
Provide a concise executive summary of the Instagram ad landscape within this category, overall strategic positioning, and predicted competitive intensity. 3-4 paragraphs.

---

## 2. Competitor Ad Analysis
For each of the ${numCompetitors} competitors, create a detailed subsection:

### Ad #[N]: [Real Competitor Brand Name]
- **Ad Strategy Summary**: Their messaging approach
- **Alignment with Campaign Objective**: How it serves their goals
- **Strengths**: What works well
- **Weaknesses**: Where their advertising falls short
- **Emotional Triggers Detected**: What emotions they target
- **Persuasion Techniques Used**: Specific techniques identified
- **Funnel Stage Classification**: TOFU / MOFU / BOFU
- **Conversion Probability Assessment**: Low / Moderate / High with reasoning
- **Estimated Success Outlook**: Low / Moderate / High

---

## 3. Instagram Creative & Design Intelligence
Analyze category-wide Instagram design patterns:
- **Visual Trends**: Current design patterns in this niche
- **Color Psychology Usage**: Colors that perform well and why
- **Typography Patterns**: Font styles and text overlay trends
- **Offer Presentation Style**: How offers and CTAs are framed
- **CTA Placement Effectiveness**: Where CTAs work best
- **Engagement Drivers**: What drives likes, comments, shares
- **Hashtag Strategy**: 15-20 relevant hashtags grouped by reach tier
- **Best Posting Times**: Based on audience behavior

---

## 4. Strategic Positioning & Opportunity Gap
- **Competitor Positioning Overview**: Where each competitor sits
- **Gap Against ${companyName} Positioning**: Specific gaps to exploit
- **Underserved Angles**: Messaging angles nobody is using
- **Market Opportunity Areas**: Untapped segments or channels
- **Strategic Recommendations**: 5 specific recommendations for higher conversion

---

## 5. Creative Ad Concepts for ${companyName}
Generate 3 detailed creative ad image concepts that ${companyName} should use:

### Concept [N]: [Creative Title]
- **Visual Composition**: Exact image layout, elements, and arrangement
- **Color Palette**: Specific hex codes and color strategy
- **Typography**: Font style, hierarchy, and text content
- **Hero Element**: Main visual focus (product shot, lifestyle, etc.)
- **CTA Design**: Button style, text, and placement
- **Emotional Tone**: The feeling the ad should evoke
- **Platform Format**: Instagram Feed / Story / Reel recommendation
- **Headline**: The primary ad headline
- **Body Copy**: 2-3 sentence supporting text
- **Why It Works**: Strategic reasoning for this creative direction

---

## 6. Performance Predictions & KPIs
- **Expected CTR Range**: Based on industry benchmarks
- **Estimated Engagement Rate**: Likes, comments, shares projection
- **Recommended A/B Test Variables**: What to test first
- **Budget Allocation Suggestion**: How to split spend across creatives
- **Optimization Timeline**: Week-by-week optimization plan

---

*Generated by Genome AI - AI-Powered Marketing Intelligence*

Generate the full report now with specific, actionable, data-driven insights.`

    // Step 1: Generate the text report
    let reportMarkdown: string
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 8000,
        temperature: 0.7,
      })

      reportMarkdown = response.choices[0]?.message?.content || ''
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please check your API key configuration and try again.' },
        { status: 503 }
      )
    }

    if (!reportMarkdown) {
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 502 }
      )
    }

    // Step 2: Generate creative reference images
    let creativeReferences: CreativeReference[] = []
    try {
      const imagePrompts = [
        {
          title: 'Premium Product Shot',
          description: `Studio-quality product photography for ${companyName}. Clean minimalist composition with professional lighting, perfect for Instagram feed ads.`,
          prompt: `Ultra high-end commercial product photography for ${productDescription}. Shot on white seamless background with dramatic studio lighting. Clean minimalist composition, soft shadows, professional color grading. Shot with a Canon EOS R5, 85mm lens, f/2.8. No text, no logos, no words, no letters, no watermarks. Pure product photography only. Photorealistic, magazine quality, 8K detail.`,
          style: 'Premium Minimalist',
          platform: 'Instagram Feed',
        },
        {
          title: 'Lifestyle Context',
          description: `Aspirational lifestyle photography showing ${companyName}'s product in a real-world setting with warm, authentic visual storytelling.`,
          prompt: `Professional lifestyle photography for ${productDescription} in an aspirational real-world setting. Golden hour natural lighting, shallow depth of field, warm color tones. Product naturally integrated into a beautiful scene with an attractive model or elegant environment. Shot by a professional photographer for a luxury magazine editorial. No text, no logos, no words, no letters, no watermarks, no overlays. Pure photography only. Photorealistic, cinematic quality.`,
          style: 'Lifestyle Editorial',
          platform: 'Instagram Story',
        },
        {
          title: 'Flat Lay Composition',
          description: `Curated flat lay photography for ${companyName} featuring the product alongside complementary accessories in an aesthetically pleasing arrangement.`,
          prompt: `Professional flat lay photography for ${productDescription}. Overhead shot of product beautifully arranged with complementary props and accessories on a clean marble or linen surface. Soft natural lighting from a window, pastel and neutral tones, Instagram-worthy aesthetic composition. Shot for a high-end e-commerce brand lookbook. No text, no logos, no words, no letters, no watermarks. Pure photography only. Photorealistic, editorial quality.`,
          style: 'Curated Flat Lay',
          platform: 'Instagram Feed',
        },
      ]

      const imagePromises = imagePrompts.map(async (concept) => {
        try {
          const imageUrl = await generateImage(concept.prompt)
          let imageBase64: string | null = null
          if (imageUrl) {
            imageBase64 = await fetchImageToBase64(imageUrl)
          }
          return {
            title: concept.title,
            description: concept.description,
            imageBase64,
            style: concept.style,
            platform: concept.platform,
          }
        } catch {
          return {
            title: concept.title,
            description: concept.description,
            imageBase64: null,
            style: concept.style,
            platform: concept.platform,
          }
        }
      })

      creativeReferences = await Promise.all(imagePromises)
    } catch (imageError) {
      console.error('Image generation error:', imageError)
    }

    // Save to Supabase (best effort)
    try {
      await supabaseAdmin
        .from('ad_intelligence_reports')
        .insert({
          user_id: userId,
          company_name: companyName,
          product_description: productDescription,
          target_audience: targetAudience || null,
          competitor_count: numCompetitors,
          report_markdown: reportMarkdown,
        })
    } catch (saveError) {
      console.error('Error saving ad intelligence report:', saveError)
    }

    return NextResponse.json({
      report: reportMarkdown,
      creativeReferences,
    })
  } catch (error) {
    console.error('Ad intelligence error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ad intelligence report. Please try again.' },
      { status: 500 }
    )
  }
}
