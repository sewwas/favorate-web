'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

// Track last attempt time
let lastAttemptTime = 0;
const RETRY_DELAY = 60000; // 1 minute delay

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5
    }
  }
})

interface Profile {
  id: string
  role: 'admin' | 'sales' | 'user'
  created_at: string
}

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
  const [initializing, setInitializing] = useState(true)

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!session && window.location.pathname !== '/login') {
          router.replace('/login')
        }
        setInitializing(false)
      } catch (error) {
        console.error('Error initializing session:', error)
        router.replace('/login')
      }
    }

    initializeSession()
  }, [router])

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
      } catch (error) {
        console.error('Error getting session:', error)
        return null
      }
    },
    enabled: !initializing
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, role, created_at')
          .eq('id', session.user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: session.user.id, role: 'user' }])
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              return null
            }
            return newProfile as Profile
          }
          console.error('Error fetching profile:', error)
          return null
        }
        return profile as Profile
      } catch (error) {
        console.error('Error in profile flow:', error)
        return null
      }
    },
    enabled: !!session?.user?.id && !initializing
  })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        queryClient.invalidateQueries({ queryKey: ['session'] })
        queryClient.invalidateQueries({ queryKey: ['profile'] })
      } else if (event === 'SIGNED_OUT') {
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
      // Check if enough time has passed since last attempt
      const now = Date.now();
      const timeSinceLastAttempt = now - lastAttemptTime;
      if (timeSinceLastAttempt < RETRY_DELAY) {
        const waitTime = Math.ceil((RETRY_DELAY - timeSinceLastAttempt) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before trying again.`);
      }

      // Update last attempt time
      lastAttemptTime = now;

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        if (error.status === 429) {
          throw new Error('Please wait 1 minute before trying again.')
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password.')
        }
        throw error
      }
      
      // Reset last attempt time on successful login
      lastAttemptTime = 0;
      router.replace('/')
    } catch (error: any) {
      console.error('Error signing in:', error)
      throw error
    }
  }, [router])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      queryClient.clear()
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [router])

  const isAdmin = profile?.role === 'admin'
  const isSales = profile?.role === 'sales'
  const isAuthenticated = !!session?.user
  const isLoading = initializing || isSessionLoading || (!!session?.user && isProfileLoading)

  if (initializing) {
    return null
  }

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