'use client'

import { useState } from 'react'
import { useSales } from '@/lib/hooks/use-sales'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, TrashIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RecordSaleForm } from '@/components/sales/record-sale-form'
import { toast } from 'sonner'
import { Sale } from '@/types/schema'

export default function SalesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { data: sales, isLoading, deleteSale } = useSales(format(selectedDate, 'yyyy-MM-dd'))

  const handleDelete = async (id: number) => {
    try {
      await deleteSale(id)
      toast.success('Sale deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete sale')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Management</h1>
          <p className="text-gray-600">View and manage daily sales records</p>
        </div>
        <RecordSaleForm />
      </div>

      <div className="mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </CardContent>
          </Card>
        ) : sales && sales.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sales for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(sales as Sale[]).map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{sale.meal_set.name}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(sale.created_at), 'h:mm a')} · {sale.quantity} units
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sale.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No sales found for this date
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 