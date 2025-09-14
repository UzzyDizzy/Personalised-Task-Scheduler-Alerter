'use client'

import { useState, useEffect, createContext, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

type AuthContextType = {
  session: Session | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error fetching session:', error.message)
    }
    setSession(data?.session ?? null)
    setLoading(false)
  }

  useEffect(() => {
    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
