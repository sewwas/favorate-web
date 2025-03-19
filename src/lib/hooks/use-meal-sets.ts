'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase/client'
import { MealSet } from '@/types/schema'

export function useMealSets() {
  return useQuery<MealSet[]>({
    queryKey: ['meal-sets'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('meal_sets')
          .select(`
            id,
            name,
            is_active,
            created_at,
            meal_components (
              id,
              meal_set_id,
              item_id,
              quantity,
              created_at,
              items (
                id,
                name,
                created_at
              )
            )
          `)
          .eq('is_active', true)
          .order('name')

        if (error) {
          console.error('Error fetching meal sets:', error)
          throw error
        }

        return (data || []) as unknown as MealSet[]
      } catch (error) {
        console.error('Error in meal sets query:', error)
        throw error
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })
}