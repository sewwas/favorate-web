'use client'

import Link from 'next/link'
import { useAuth } from '@/app/providers'
import { NavMenu } from './nav-menu'

export function Nav() {
  const { isAdmin, isSales, signOut } = useAuth()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Favorite Chicken</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              <NavMenu />
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => signOut()}
              className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 