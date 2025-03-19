'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMealSets } from '@/lib/hooks/use-meal-sets'
import { useRecordSale } from '@/lib/hooks/use-record-sale'
import { MealSet } from '@/types/schema'

export function SalesForm() {
  const [selectedMealSet, setSelectedMealSet] = useState<MealSet | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { data: mealSets = [], isLoading: isLoadingMealSets } = useMealSets()
  const { mutate: recordSale, isPending: isRecording } = useRecordSale()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMealSet) return

    recordSale({
      meal_set_id: selectedMealSet.id,
      quantity
    })

    // Reset form
    setSelectedMealSet(null)
    setQuantity(1)
  }

  if (isLoadingMealSets) {
    return <div>Loading meal sets...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="meal-set" className="block text-sm font-medium text-gray-700">
              Meal Set
            </label>
            <select
              id="meal-set"
              name="meal-set"
              aria-label="Select a meal set"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={selectedMealSet?.id || ''}
              onChange={(e) => {
                const mealSet = mealSets.find((ms: MealSet) => ms.id === Number(e.target.value))
                setSelectedMealSet(mealSet || null)
              }}
              required
            >
              <option value="">Select a meal set</option>
              {mealSets.map((mealSet: MealSet) => (
                <option key={mealSet.id} value={mealSet.id}>
                  {mealSet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              aria-label="Enter quantity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={!selectedMealSet || isRecording}
            className="w-full"
          >
            {isRecording ? 'Recording...' : 'Record Sale'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 