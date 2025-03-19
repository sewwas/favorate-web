'use client'

import { useState } from 'react'
import { useUsage } from '@/lib/hooks/use-usage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { UsageItem } from '@/types/schema'
import { cn } from '@/lib/utils'

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom'

export default function UsagePage() {
  const [dateRange, setDateRange] = useState<DateRange>('daily')
  const today = new Date()
  const [customDate, setCustomDate] = useState<Date | undefined>(today)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(today)
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(today)
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false)

  const getDateRange = () => {
    switch (dateRange) {
      case 'daily':
        return {
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd')
        }
      case 'weekly':
        return {
          startDate: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
          endDate: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        }
      case 'monthly':
        return {
          startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(today), 'yyyy-MM-dd')
        }
      case 'custom':
        return {
          startDate: customStartDate ? format(customStartDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd'),
          endDate: customEndDate ? format(customEndDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd')
        }
    }
  }

  const { startDate, endDate } = getDateRange()
  const { data: usageData, isLoading } = useUsage({ startDate, endDate })

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (date) {
      setCustomDate(date)
      setDateRange('custom')
      setCustomStartDate(date)
      setCustomEndDate(date)
    }
  }

  const handleCustomRangeSelect = (date: Date | undefined) => {
    if (!date) return

    if (!customStartDate || (customStartDate && customEndDate)) {
      setCustomStartDate(date)
      setCustomEndDate(undefined)
    } else {
      if (date < customStartDate) {
        setCustomStartDate(date)
        setCustomEndDate(customStartDate)
      } else {
        setCustomEndDate(date)
      }
      setIsCustomRangeOpen(false)
    }
    setDateRange('custom')
  }

  const isDateDisabled = (date: Date) => {
    if (customStartDate && !customEndDate) {
      return date < customStartDate
    }
    return false
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Usage Tracking</h1>
        <p className="text-gray-600">Track item usage across meal sets</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Button
          variant={dateRange === 'daily' ? 'default' : 'outline'}
          onClick={() => setDateRange('daily')}
        >
          Today
        </Button>
        <Button
          variant={dateRange === 'weekly' ? 'default' : 'outline'}
          onClick={() => setDateRange('weekly')}
        >
          This Week
        </Button>
        <Button
          variant={dateRange === 'monthly' ? 'default' : 'outline'}
          onClick={() => setDateRange('monthly')}
        >
          This Month
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={dateRange === 'custom' && !isCustomRangeOpen ? 'default' : 'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !customDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDate ? format(customDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customDate}
              onSelect={handleCustomDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={dateRange === 'custom' && isCustomRangeOpen ? 'default' : 'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !customStartDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customStartDate && customEndDate
                ? `${format(customStartDate, 'PP')} - ${format(customEndDate, 'PP')}`
                : customStartDate
                ? `${format(customStartDate, 'PP')} - Pick end date`
                : 'Pick a date range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customEndDate ?? customStartDate}
              onSelect={handleCustomRangeSelect}
              initialFocus
              disabled={isDateDisabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div>Loading usage data...</div>
        ) : usageData && usageData.length > 0 ? (
          usageData.map((item: UsageItem) => (
            <Card key={item.item_name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.item_name}</span>
                  <span className="text-2xl font-bold">{item.total_used}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.breakdown.map((usage, index) => (
                    <div
                      key={`${usage.meal_set_name}-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="font-medium">{usage.meal_set_name}</span>
                        <span className="text-gray-500">
                          {' '}
                          ({usage.meals_sold} × {usage.items_per_meal})
                        </span>
                      </div>
                      <div className="font-medium">{usage.total}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No usage data found for this period
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 