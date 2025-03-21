'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

export function NavMenu() {
  const { isAdmin, isSales, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  
  const closeSheet = () => setIsOpen(false)

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link 
      href={href} 
      className="block w-full py-2 text-sm hover:bg-accent rounded-md px-3" 
      onClick={closeSheet}
    >
      {children}
    </Link>
  )
  
  return (
    <div className="flex items-center">
      {/* Mobile Navigation */}
      <div className="block md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-1">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] pt-10">
            <nav className="flex flex-col gap-4">
              <NavLink href="/dashboard">Dashboard</NavLink>
              
              {isAdmin && (
                <>
                  <NavLink href="/items">Items</NavLink>
                  <NavLink href="/meal-sets">Meal Sets</NavLink>
                </>
              )}
              
              {(isAdmin || isSales) && (
                <NavLink href="/sales">Sales Entry</NavLink>
              )}
              
              <NavLink href="/usage">Usage Tracking</NavLink>
              
              <Button 
                variant="ghost" 
                onClick={() => {
                  signOut();
                  closeSheet();
                }}
                className="justify-start px-3 font-normal"
              >
                Sign Out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          
          {isAdmin && (
            <>
              <Link href="/items" className="text-sm font-medium hover:text-gray-900 transition-colors">
                Items
              </Link>
              <Link href="/meal-sets" className="text-sm font-medium hover:text-gray-900 transition-colors">
                Meal Sets
              </Link>
            </>
          )}
          
          {(isAdmin || isSales) && (
            <Link href="/sales" className="text-sm font-medium hover:text-gray-900 transition-colors">
              Sales Entry
            </Link>
          )}
          
          <Link href="/usage" className="text-sm font-medium hover:text-gray-900 transition-colors">
            Usage Tracking
          </Link>
        </nav>

        <Button 
          variant="ghost" 
          onClick={() => signOut()}
          className="text-sm font-medium"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
} 