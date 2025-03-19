'use client'

import { SalesForm } from '@/components/sales/sales-form'
import { useDailyUsage } from '@/lib/hooks/use-usage'
import { UsageItem } from '@/types/schema'

export default function SalesPage() {
  const today = new Date().toISOString().split('T')[0]
  const { data: usageData, isLoading } = useDailyUsage(today)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Record Sales</h1>
      <SalesForm />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Today's Usage Summary</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="mb-4">
              Total items used today: {usageData.total_items} ({usageData.unique_items} unique items)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageData.items.map((item: UsageItem, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">{item.item_name}</h3>
                  <p>Total used: {item.total_used}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 