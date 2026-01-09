import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return null

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

