import { useEffect } from 'react'
import { router, useSegments } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function Index() {
  const segments = useSegments()

  useEffect(() => {
    const checkSession = async () => {
      // Don't redirect if user is already on a specific route (like reset-password)
      if (segments.length > 0) {
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/(tabs)')
      } else {
        router.replace('/login')
      }
    }
    
    // Small delay to allow deep links to be processed first
    const timer = setTimeout(checkSession, 100)
    return () => clearTimeout(timer)
  }, [segments])

  return null 
}
