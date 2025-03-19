export type UserRole = 'admin' | 'sales'

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
          name: string
        }
        Update: {
          name?: string
        }
      }
      meal_sets: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
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
          meal_set_id: number
          item_id: number
          quantity: number
        }
        Update: {
          quantity?: number
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
          meal_set_id: number
          quantity: number
          sale_date: string
        }
        Update: {
          quantity?: number
          sale_date?: string
        }
      }
    }
    Views: {
      daily_usage: {
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
      [_ in string]: never
    }
    Enums: {
      [_ in string]: never
    }
  }
} 