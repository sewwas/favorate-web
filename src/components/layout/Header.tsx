'use client'

import Image from 'next/image'
import { useAuth } from '@/app/providers'
import { NavMenu } from './nav-menu'

export function Header() {
  const { isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-12 sm:h-14 md:h-16 items-center justify-between px-2 sm:px-4 md:px-8">
        <div className="flex items-center">
          <div className="relative h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-40 lg:h-12 lg:w-48">
            <Image
              src="/logo.png"
              alt="Favorite Chicken Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <NavMenu />
        </div>
      </div>
    </header>
  )
} 