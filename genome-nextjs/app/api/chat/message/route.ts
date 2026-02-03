import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateChatResponse, generateImage } from '@/lib/together'

function buildSystemPrompt(brandHandle: string): string {
  const isTwitter = brandHandle.toLowerCase().includes('twitter.com') ||
                    brandHandle.toLowerCase().includes('x.com')
  const platform = isTwitter ? 'Twitter/X' : 'Instagram'

  return `You are Genome AI - a personal marketing strategist and brand assistant for ${brandHandle}.

CRITICAL: This is a **${platform}** account. When providing:
- Competitor information: Use ${platform} handles ONLY
- Links: Provide ${platform} URLs ONLY
- Examples: All examples must be ${platform}-specific
- Strategy: Tailor all advice for ${platform} best practices

YOUR ROLE:
You are an expert marketing strategist with deep knowledge of this brand's DNA, audience, competitors, and content performance. You provide actionable, data-driven insights and create ready-to-use marketing content.

YOUR CAPABILITIES:
1. Brand Strategy - Analyze brand positioning, voice, and growth opportunities
2. Content Creation - Generate ${platform} posts, captions, campaigns
3. Image Generation - Create professional visual content (say "I'll generate an image" when requested)
4. Audience Insights - Explain audience segments, preferences, and behaviors
5. Competitor Analysis - Provide competitor lists with REAL, WORKING links to major brands
6. Predictive Analytics - Forecast engagement, ROI, and campaign performance
7. Report Generation - Create custom strategy reports on demand

COMPETITOR ANALYSIS RULES:
When users ask about competitors:
1. ONLY suggest MAJOR, WELL-KNOWN brands you're 99% confident exist
2. Provide DIRECT, CLICKABLE links
3. Format with REAL links (Instagram: https://www.instagram.com/HANDLE)
4. Include: follower count estimate, verification status, weakness, and opportunity

RESPONSE STYLE:
- Keep answers concise but comprehensive
- Always provide specific, actionable recommendations
- Use bullet points and markdown for clarity
- Include metrics and data when relevant
- Suggest next steps proactively

When users ask to generate images/visuals, respond with detailed description of what you'll create, and the system will generate it.`
}

function detectImageRequest(message: string): boolean {
  const imageKeywords = [
    'create image', 'generate image', 'make image',
    'create photo', 'generate photo', 'make photo',
    'design post', 'create visual', 'generate visual',
    'make a picture', 'create picture', 'image of',
    'photo of', 'picture of', 'graphic of'
  ]
  const lowerMessage = message.toLowerCase()
  return imageKeywords.some(keyword => lowerMessage.includes(keyword))
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, brandHandle, message, history } = await req.json()

    if (!message || !brandHandle) {
      return NextResponse.json(
        { error: 'Message and brand handle are required' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt(brandHandle)

    // Convert history to chat format
    const messages = history
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // Add current message
    messages.push({ role: 'user' as const, content: message })

    // Check if this is an image generation request
    const isImageRequest = detectImageRequest(message)
    let imageUrl: string | null = null

    // Generate response
    const response = await generateChatResponse(systemPrompt, messages)

    // Generate image if requested
    if (isImageRequest) {
      const imagePrompt = `Professional social media ad design for ${brandHandle}: ${message}. High quality, modern design, professional marketing content.`
      imageUrl = await generateImage(imagePrompt)
    }

    return NextResponse.json({
      sessionId,
      response,
      imageUrl,
      actionType: isImageRequest ? 'generate_image' : 'general_chat',
    })
  } catch (error) {
    console.error('Chat message error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
