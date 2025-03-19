'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface RecordSaleInput {
  meal_set_id: number
  quantity: number
  sale_date?: string
}

export function useRecordSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RecordSaleInput) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          meal_set_id: input.meal_set_id,
          quantity: input.quantity,
          sale_date: input.sale_date || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate daily usage query to refresh the summary
      queryClient.invalidateQueries({ queryKey: ['daily-usage'] })
    }
  })
} 