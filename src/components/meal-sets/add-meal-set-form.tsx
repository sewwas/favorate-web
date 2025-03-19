'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { useItems } from '@/lib/hooks/use-items'
import { Item } from '@/types/schema'

interface MealSetFormData {
  name: string
  components: Array<{
    item_id: number
    quantity: number
  }>
}

interface AddMealSetFormProps {
  onSubmit: (data: MealSetFormData) => Promise<void>
}

export function AddMealSetForm({ onSubmit }: AddMealSetFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [components, setComponents] = useState<Array<{ item_id: number; quantity: number }>>([])
  const { data: items } = useItems()

  const handleAddComponent = () => {
    setComponents([...components, { item_id: 0, quantity: 1 }])
  }

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index))
  }

  const handleUpdateComponent = (index: number, field: 'item_id' | 'quantity', value: number) => {
    const newComponents = [...components]
    newComponents[index] = { ...newComponents[index], [field]: value }
    setComponents(newComponents)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || components.length === 0 || components.some(c => c.item_id === 0)) {
      return
    }

    await onSubmit({ name, components })
    setName('')
    setComponents([])
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Meal Set
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Meal Set</DialogTitle>
          <DialogDescription>
            Create a new meal set by adding items and their quantities.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter meal set name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Components</label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddComponent}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Component
              </Button>
            </div>

            {components.map((component, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={component.item_id.toString()}
                  onValueChange={(value: string) => handleUpdateComponent(index, 'item_id', parseInt(value))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items?.map((item: Item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min="1"
                  value={component.quantity}
                  onChange={(e) =>
                    handleUpdateComponent(index, 'quantity', parseInt(e.target.value) || 1)
                  }
                  className="w-20"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveComponent(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || components.length === 0}>
              Create Meal Set
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 