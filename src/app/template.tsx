'use client'

import { Header } from '@/components/layout/Header'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="relative min-h-screen">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </>
  )
} 