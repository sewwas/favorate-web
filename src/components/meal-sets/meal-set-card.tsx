'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { MealSet } from '@/types/schema'

interface MealSetCardProps {
  mealSet: MealSet
  onDelete: (id: number) => void
}

export function MealSetCard({ mealSet, onDelete }: MealSetCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">{mealSet.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(mealSet.id)}
          className="h-8 w-8 text-red-500 hover:text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
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
    </Card>
  )
} 