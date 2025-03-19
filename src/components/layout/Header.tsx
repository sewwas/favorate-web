'use client'

import Image from 'next/image'
import Link from 'next/link'
import { NavMenu } from './nav-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Favorite Chicken</span>
          </Link>
          <NavMenu />
        </div>
      </div>
    </header>
  )
} 