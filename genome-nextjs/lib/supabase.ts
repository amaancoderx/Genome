import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase

// Database types
export interface ChatSession {
  id: string
  user_id: string
  brand_handle: string
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image_url?: string
  timestamp: string
}

export interface GenomeReport {
  id: string
  user_id: string
  brand_input: string
  brand_dna: Record<string, unknown>
  competitors: Record<string, unknown>
  growth_roadmap: Record<string, unknown>
  content_strategy: Record<string, unknown>
  pdf_url?: string
  created_at: string
}

export interface AdGeneration {
  id: string
  user_id: string
  keyword: string
  company_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  results?: Record<string, unknown>
  pdf_url?: string
  created_at: string
  updated_at: string
}

// Helper functions
export async function saveGenomeReport(
  userId: string,
  report: Omit<GenomeReport, 'id' | 'user_id' | 'created_at'>
) {
  const { data, error } = await supabaseAdmin
    .from('genome_reports')
    .insert({
      user_id: userId,
      ...report,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserReports(userId: string) {
  const { data, error } = await supabase
    .from('genome_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function saveAdGeneration(
  userId: string,
  adGen: Omit<AdGeneration, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabaseAdmin
    .from('ad_generations')
    .insert({
      user_id: userId,
      ...adGen,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAdGeneration(
  id: string,
  updates: Partial<AdGeneration>
) {
  const { data, error } = await supabaseAdmin
    .from('ad_generations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
