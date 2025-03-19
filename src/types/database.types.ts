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
      items: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      meal_components: {
        Row: {
          id: number
          meal_set_id: number
          item_id: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          meal_set_id: number
          item_id: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          meal_set_id?: number
          item_id?: number
          quantity?: number
          created_at?: string
        }
      }
      meal_sets: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          meal_set_id: number
          quantity: number
          sale_date: string
          created_at: string
        }
        Insert: {
          id?: number
          meal_set_id: number
          quantity: number
          sale_date?: string
          created_at?: string
        }
        Update: {
          id?: number
          meal_set_id?: number
          quantity?: number
          sale_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      usage_tracking: {
        Row: {
          sale_date: string
          item_id: number
          item_name: string
          meal_set_id: number
          meal_set_name: string
          items_per_meal: number
          meals_sold: number
          total_used: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 