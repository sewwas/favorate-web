import { supabase } from './client'
import { Database } from '@/types/supabase'
import { MealSet, MealComponent, DailyUsageSummary, ItemUsageSummary } from '@/types/schema'

// Meal Sets
export async function getMealSets() {
  const { data, error } = await supabase
    .from('meal_sets')
    .select(`
      *,
      meal_components (
        *,
        items (*)
      )
    `)
    .order('name')

  if (error) throw error
  return data as MealSet[]
}

export async function createMealSet(name: string) {
  const { data, error } = await supabase
    .from('meal_sets')
    .insert([{ name }])
    .select()
    .single()

  if (error) throw error
  return data as MealSet
}

export async function deleteMealSet(id: number) {
  const { error } = await supabase
    .from('meal_sets')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Meal Components
export async function addMealComponent(mealSetId: number, itemId: number, quantity: number) {
  const { data, error } = await supabase
    .from('meal_components')
    .insert([{
      meal_set_id: mealSetId,
      item_id: itemId,
      quantity
    }])
    .select()
    .single()

  if (error) throw error
  return data as MealComponent
}

export async function removeMealComponent(id: number) {
  const { error } = await supabase
    .from('meal_components')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Daily Usage
export async function getDailyUsage(date: string) {
  const { data, error } = await supabase
    .from('daily_usage')
    .select('*')
    .eq('sale_date', date)

  if (error) throw error
  return data as DailyUsageSummary[]
}

// Usage Summary
export async function getUsageSummary(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('daily_usage')
    .select('*')
    .gte('sale_date', startDate)
    .lte('sale_date', endDate)

  if (error) throw error

  // Group by item
  const summary = data.reduce((acc, curr) => {
    const key = curr.item_name
    if (!acc[key]) {
      acc[key] = {
        item_name: key,
        total_used: 0,
        breakdown: []
      }
    }
    acc[key].total_used += curr.total_used
    acc[key].breakdown.push({
      meal_set_name: curr.meal_set_name,
      meals_sold: curr.meals_sold,
      items_per_meal: curr.items_per_meal,
      total: curr.total_used,
      sale_date: curr.sale_date
    })
    return acc
  }, {} as Record<string, ItemUsageSummary>)

  return Object.values(summary)
} 