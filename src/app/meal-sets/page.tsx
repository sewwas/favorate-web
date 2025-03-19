'use client'

import { useEffect } from 'react'
import { useMealSets } from '@/lib/hooks/use-meal-sets'
import { MealSetCard } from '@/components/meal-sets/meal-set-card'
import { AddMealSetForm } from '@/components/meal-sets/add-meal-set-form'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function MealSetsPage() {
  const { data: mealSets, isLoading: isMealSetsLoading, error, refetch } = useMealSets()
  const router = useRouter()
  const { isAdmin, session, isLoading: isAuthLoading } = useAuth()
  const queryClient = useQueryClient()

  // Handle authentication and authorization
  useEffect(() => {
    if (isAuthLoading) return

    if (!session) {
      router.replace('/login')
      return
    }

    if (!isAdmin) {
      router.replace('/')
      return
    }
  }, [isAuthLoading, session, isAdmin, router])

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not admin
  if (!session || !isAdmin) {
    return null
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('meal_sets')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      
      toast.success('Meal set archived successfully')
      queryClient.invalidateQueries({ queryKey: ['meal-sets'] })
    } catch (error) {
      console.error('Error archiving meal set:', error)
      toast.error('Failed to archive meal set')
    }
  }

  const handleAddMealSet = async (data: {
    name: string
    components: Array<{ item_id: number; quantity: number }>
  }) => {
    try {
      const itemIds = data.components.map(c => c.item_id)
      const uniqueItemIds = new Set(itemIds)
      if (itemIds.length !== uniqueItemIds.size) {
        toast.error('Each item can only be added once to a meal set')
        return
      }

      const { data: mealSet, error: mealSetError } = await supabase
        .from('meal_sets')
        .insert([{ name: data.name, is_active: true }])
        .select()
        .single()

      if (mealSetError || !mealSet) {
        if (mealSetError?.code === '23505') {
          toast.error('A meal set with this name already exists')
        } else {
          toast.error('Failed to create meal set')
        }
        throw mealSetError || new Error('Failed to create meal set')
      }

      for (const component of data.components) {
        const { error: componentError } = await supabase
          .from('meal_components')
          .insert({
            meal_set_id: mealSet.id,
            item_id: component.item_id,
            quantity: component.quantity
          })

        if (componentError) {
          await supabase.from('meal_sets').delete().eq('id', mealSet.id)
          toast.error(`Failed to add item to meal set`)
          throw componentError
        }
      }

      toast.success('Meal set created successfully')
      queryClient.invalidateQueries({ queryKey: ['meal-sets'] })
    } catch (error: any) {
      console.error('Error creating meal set:', error)
      if (!error.message?.includes('Failed to add item')) {
        toast.error('Failed to create meal set')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meal Sets</h1>
          <p className="text-gray-600">Manage your meal set configurations</p>
        </div>
        <AddMealSetForm onSubmit={handleAddMealSet} />
      </div>

      {isMealSetsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading meal sets</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : mealSets?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No meal sets found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mealSets?.map((mealSet) => (
            <MealSetCard key={mealSet.id} mealSet={mealSet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}