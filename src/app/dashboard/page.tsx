'use client';

import { useDailyUsage } from '@/lib/hooks/use-usage'
import { UsageItem } from '@/types/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[35%] pr-2">Item Name</TableHead>
                          <TableHead className="w-[15%] px-2 text-right">Total Used</TableHead>
                          <TableHead className="w-[50%] pl-8 text-right">Breakdown</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usageData.items.map((item: UsageItem) => (
                          <TableRow key={item.item_name}>
                            <TableCell className="font-medium pr-2">{item.item_name}</TableCell>
                            <TableCell className="px-2 text-right font-medium">{item.total_used}</TableCell>
                            <TableCell className="pl-8 text-right">
                              <div className="text-sm text-gray-500 space-y-1">
                                {item.breakdown.map((breakdown, index) => (
                                  <div key={index} className="whitespace-nowrap">
                                    {breakdown.meal_set_name}: {breakdown.total}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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