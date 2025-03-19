'use client';

import { useDailyUsage } from '@/lib/hooks/use-usage'
import { UsageItem } from '@/types/schema'

export default function DashboardPage() {
  const today = new Date().toISOString().split('T')[0]
  const { data: usageData, isLoading } = useDailyUsage(today)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Today's Usage Overview</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Total Items Used</h3>
                  <p className="text-3xl font-bold">{usageData.total_items}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Unique Items</h3>
                  <p className="text-3xl font-bold">{usageData.unique_items}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Item Breakdown</h3>
                  <div className="space-y-4">
                    {usageData.items.map((item: UsageItem) => (
                      <div key={item.item_name} className="flex justify-between items-center">
                        <span className="font-medium">{item.item_name}</span>
                        <span className="text-gray-600">{item.total_used} used</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
} 