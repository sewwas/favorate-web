'use client'

import { Header } from './Header'
import { useAuth } from '@/app/providers'
import { LoadingSpinner } from '../ui/loading-spinner'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex-1 space-y-4 px-4 py-8 sm:px-8 md:space-y-6">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-muted-foreground md:flex-row md:space-y-0">
            <p>© {new Date().getFullYear()} Favorite Chicken. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}