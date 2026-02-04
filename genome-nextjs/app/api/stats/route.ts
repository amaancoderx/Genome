import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current month's start date
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Fetch chat sessions count for this month
    let chatsCount = 0
    try {
      const { count, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth)

      if (!error) {
        chatsCount = count || 0
      }
    } catch (e) {
      console.log('Chat sessions table may not exist')
    }

    // Fetch genome reports count (all time)
    let reportsCount = 0
    try {
      const { count, error } = await supabaseAdmin
        .from('genome_reports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (!error) {
        reportsCount = count || 0
      }
    } catch (e) {
      console.log('Genome reports table may not exist')
    }

    // Fetch executed strategies count (all time)
    let strategiesCount = 0
    try {
      const { count, error } = await supabaseAdmin
        .from('executed_strategies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (!error) {
        strategiesCount = count || 0
      }
    } catch (e) {
      console.log('Executed strategies table may not exist')
    }

    // Fetch completed tasks count
    let tasksCompletedCount = 0
    try {
      const { count, error } = await supabaseAdmin
        .from('strategy_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (!error) {
        tasksCompletedCount = count || 0
      }
    } catch (e) {
      console.log('Strategy tasks table may not exist')
    }

    return NextResponse.json({
      chatsThisMonth: chatsCount,
      reportsGenerated: reportsCount,
      strategiesExecuted: strategiesCount,
      tasksCompleted: tasksCompletedCount,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    // Return zeros on error instead of failing
    return NextResponse.json({
      chatsThisMonth: 0,
      reportsGenerated: 0,
      strategiesExecuted: 0,
      tasksCompleted: 0,
    })
  }
}
