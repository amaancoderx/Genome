import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get existing profile from Supabase
    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is okay
      console.error('Error fetching profile:', error)
    }

    return NextResponse.json({
      profile: data?.profile_data || null,
      hasProfile: !!data
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profile } = await request.json()

    // Upsert the profile (insert or update)
    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .upsert({
        user_id: userId,
        profile_data: profile,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Error saving profile:', error)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: data?.[0]?.profile_data
    })
  } catch (error) {
    console.error('Profile save error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
