import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Database } from '@/types/supabase';

type Sale = Database['public']['Tables']['sales']['Row'];
type SaleInsert = Database['public']['Tables']['sales']['Insert'];

export function useSales(date?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Sale[]>({
    queryKey: ['sales', date],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select(`
          *,
          meal_set:meal_sets(*)
        `)
        .order('created_at', { ascending: false });

      if (date) {
        query = query.eq('sale_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  const createSale = useMutation({
    mutationFn: async (input: SaleInsert) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['daily-usage'] });
    }
  });

  const deleteSale = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['daily-usage'] });
    }
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createSale: createSale.mutateAsync,
    deleteSale: deleteSale.mutateAsync
  };
} 