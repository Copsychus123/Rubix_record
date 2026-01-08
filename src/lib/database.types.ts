export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          email: string
          name: string | null
          source: string | null
          created_at: string
          status: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          source?: string | null
          created_at?: string
          status?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          source?: string | null
          created_at?: string
          status?: string | null
        }
        Relationships: []
      },
      waitlist: {
        Row: {
          id: number
          email: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
