'use client'

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/schema';

export function useItems() {
  const query = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Item[];
    }
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error
  };
} 