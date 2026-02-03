import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandHandle } = await req.json()

    if (!brandHandle) {
      return NextResponse.json(
        { error: 'Brand handle is required' },
        { status: 400 }
      )
    }

    // Generate session ID
    const sessionId = crypto.randomUUID()

    // Detect platform type
    const isTwitter = brandHandle.toLowerCase().includes('twitter.com') ||
                      brandHandle.toLowerCase().includes('x.com')
    const platform = isTwitter ? 'Twitter/X' : 'Instagram'

    const welcomeMessage = `Hi! I'm your personal AI strategist for **${brandHandle}**.

I can help you with:
- Content creation (${platform} posts, captions, campaigns)
- Audience insights and personas
- Competitor analysis with links
- Growth strategies
- Engagement predictions
- Weekly content planning

What would you like to work on today?`

    return NextResponse.json({
      sessionId,
      brandHandle,
      welcomeMessage,
      platform,
    })
  } catch (error) {
    console.error('Chat init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize chat' },
      { status: 500 }
    )
  }
}
