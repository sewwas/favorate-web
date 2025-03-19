'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { MealSet } from '@/types/schema'
import { useState } from 'react'
import { EditMealSetForm } from './edit-meal-set-form'

interface MealSetCardProps {
  mealSet: MealSet
  onDelete: (id: number) => void
  onEdit: (id: number, data: { name: string; components: Array<{ item_id: number; quantity: number }> }) => Promise<void>
}

export function MealSetCard({ mealSet, onDelete, onEdit }: MealSetCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">{mealSet.name}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 text-gray-500 hover:text-gray-600"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(mealSet.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {mealSet.meal_components.map((component) => (
            <li key={component.id} className="text-sm text-gray-500">
              {component.quantity}x {component.items.name}
            </li>
          ))}
        </ul>
      </CardContent>
      <EditMealSetForm
        mealSet={mealSet}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={async (data) => {
          await onEdit(mealSet.id, data)
          setIsEditing(false)
        }}
      />
    </Card>
  )
} 