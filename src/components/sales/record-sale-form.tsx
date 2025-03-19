'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMealSets } from '@/lib/hooks/use-meal-sets'
import { useRecordSale } from '@/lib/hooks/use-record-sale'
import { toast } from 'sonner'

export function RecordSaleForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [mealSetId, setMealSetId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [saleDate, setSaleDate] = useState<Date>(new Date())
  const { data: mealSets } = useMealSets()
  const recordSale = useRecordSale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealSetId || !saleDate) return

    try {
      await recordSale.mutateAsync({
        meal_set_id: parseInt(mealSetId),
        quantity,
        sale_date: format(saleDate, 'yyyy-MM-dd')
      })

      toast.success('Sale recorded successfully')
      setIsOpen(false)
      setMealSetId('')
      setQuantity(1)
      setSaleDate(new Date())
    } catch (error: any) {
      toast.error(error.message || 'Failed to record sale')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Record Sale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meal Set</label>
            <Select
              value={mealSetId}
              onValueChange={setMealSetId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal set" />
              </SelectTrigger>
              <SelectContent>
                {mealSets?.map((mealSet) => (
                  <SelectItem key={mealSet.id} value={mealSet.id.toString()}>
                    {mealSet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sale Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !saleDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {saleDate ? format(saleDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={saleDate}
                  onSelect={(date) => date && setSaleDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!mealSetId || recordSale.isPending}
            >
              {recordSale.isPending ? 'Recording...' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 