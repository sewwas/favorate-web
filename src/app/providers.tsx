'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 // Cache for 5 minutes
    }
  }
})

interface Profile {
  id: string
  role: 'admin' | 'sales' | 'user'
  created_at: string
}

// Create auth context
const AuthContext = createContext<{
  session: any
  profile: Profile | null | undefined
  isAdmin: boolean
  isSales: boolean
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
} | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    }
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null

      try {
        // First try to get the profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, role, created_at')
          .eq('id', session.user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: session.user.id, role: 'user' }])
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              return null
            }

            // Refresh session to include role
            await supabase.auth.refreshSession()
            
            return newProfile as Profile
          }
          console.error('Error fetching profile:', error)
          return null
        }

        if (profile) {
          // Refresh session to ensure role is included
          await supabase.auth.refreshSession()
          return profile as Profile
        }

        return null
      } catch (error) {
        console.error('Error in profile flow:', error)
        return null
      }
    },
    enabled: !!session?.user?.id,
    retry: 2
  })

  // Effect to handle session changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Refresh queries when signed in
        queryClient.invalidateQueries({ queryKey: ['session'] })
        queryClient.invalidateQueries({ queryKey: ['profile'] })
      } else if (event === 'SIGNED_OUT') {
        // Clear queries when signed out
        queryClient.clear()
        router.replace('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      // Navigate to home page after successful sign in
      router.replace('/')
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }, [router])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [router])

  const isAdmin = profile?.role === 'admin'
  const isSales = profile?.role === 'sales'
  const isAuthenticated = !!session?.user
  const isLoading = isSessionLoading || (!!session?.user && isProfileLoading)

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isAdmin,
        isSales,
        isAuthenticated,
        isLoading,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}