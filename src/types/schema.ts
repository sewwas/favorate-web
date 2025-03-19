export interface Item {
  id: number
  name: string
  created_at: string
}

export interface MealComponent {
  id: number
  meal_set_id: number
  item_id: number
  quantity: number
  items: Item
  created_at: string
}

export interface MealSet {
  id: number
  name: string
  is_active?: boolean
  meal_components: MealComponent[]
  created_at: string
}

export interface Sale {
  id: number
  meal_set_id: number
  quantity: number
  sale_date: string
  meal_set: MealSet
  created_at: string
}

export interface UsageBreakdown {
  meal_set_name: string
  meals_sold: number
  items_per_meal: number
  total: number
}

export interface UsageItem {
  item_name: string
  total_used: number
  breakdown: UsageBreakdown[]
}

export interface DailyUsageSummary {
  date: string
  items: UsageItem[]
  total_items: number
  unique_items: number
}

export interface ItemUsageSummary {
  item_name: string
  total_used: number
  breakdown: Array<UsageBreakdown & { sale_date: string }>
} 