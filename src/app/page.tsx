'use client'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Favorite Chicken</h1>
        <p className="text-muted-foreground">
          Track and manage meal sets, sales, and item usage.
        </p>
      </div>
      <div className="flex space-x-4">
        <Button asChild>
          <a href="/meal-sets">View Meal Sets</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/sales">Record Sales</a>
        </Button>
      </div>
    </div>
  )
} 