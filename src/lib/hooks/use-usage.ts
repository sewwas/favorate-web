import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase/client'
import { UsageBreakdown, UsageItem } from '@/types/schema'

interface UsageParams {
  startDate: string
  endDate: string
}

interface DailyUsageSummary {
  date: string
  items: UsageItem[]
  total_items: number
  unique_items: number
}

interface SaleResponse {
  sale_date: string
  item_name: string
  meal_set_name: string
  items_per_meal: number
  meals_sold: number
  total_used: number
}

export function useUsage({ startDate, endDate }: UsageParams) {
  return useQuery({
    queryKey: ['usage', startDate, endDate],
    queryFn: async () => {
      const { data: rawData, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .filter('sale_date', 'gte', startDate)
        .filter('sale_date', 'lte', endDate)
        .throwOnError()

      if (error) {
        console.error('Error fetching usage data:', error)
        return []
      }

      const data = rawData as SaleResponse[]

      // Transform the data to calculate usage by item
      const usageByItem = new Map<string, { total: number; breakdown: Map<string, UsageBreakdown> }>()

      data.forEach((record) => {
        const { item_name, meal_set_name, items_per_meal, meals_sold, total_used } = record

        if (!usageByItem.has(item_name)) {
          usageByItem.set(item_name, {
            total: 0,
            breakdown: new Map()
          })
        }

        const itemUsage = usageByItem.get(item_name)!
        itemUsage.total += total_used

        if (!itemUsage.breakdown.has(meal_set_name)) {
          itemUsage.breakdown.set(meal_set_name, {
            meal_set_name,
            meals_sold: 0,
            items_per_meal,
            total: 0
          })
        }

        const breakdown = itemUsage.breakdown.get(meal_set_name)!
        breakdown.meals_sold += meals_sold
        breakdown.total += total_used
      })

      // Convert the Map to the expected format
      const result: UsageItem[] = Array.from(usageByItem.entries()).map(([itemName, usage]) => ({
        item_name: itemName,
        total_used: usage.total,
        breakdown: Array.from(usage.breakdown.values())
      }))

      return result
    },
    retry: 2
  })
}

export function useDailyUsage(date: string) {
  const { data: items, isLoading } = useUsage({ startDate: date, endDate: date })

  const summary: DailyUsageSummary = {
    date,
    items: items || [],
    total_items: items?.reduce((sum, item) => sum + item.total_used, 0) || 0,
    unique_items: items?.length || 0
  }

  return {
    data: summary,
    isLoading
  }
} 