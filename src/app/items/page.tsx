'use client';

import { useState } from 'react';
import { useItems } from '@/lib/hooks/use-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Item } from '@/types/schema';

export default function ItemsPage() {
  const { data: items = [], isLoading, error } = useItems();
  const [newItemName, setNewItemName] = useState('');
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('items')
        .insert([{ name }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await createItemMutation.mutateAsync(newItemName.trim());
      setNewItemName('');
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      await deleteItemMutation.mutateAsync(itemId);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Items Management</h1>
        <p className="text-gray-600">Add or remove items from your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter item name"
          className="max-w-xs"
        />
        <Button type="submit">Add Item</Button>
      </form>

      {isLoading ? (
        <div>Loading items...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <span>{item.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 