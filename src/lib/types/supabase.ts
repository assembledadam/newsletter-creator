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
      newsletters: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          source_url: string | null
          items: Json | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          source_url?: string | null
          items?: Json | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          source_url?: string | null
          items?: Json | null
          user_id?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          prompt_template: string
          newsletter_template: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          prompt_template: string
          newsletter_template: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          prompt_template?: string
          newsletter_template?: string
          updated_at?: string
        }
      }
    }
  }
}