import { useEffect } from 'react'
import { router } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function Index() {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/(tabs)')
      } else {
        router.replace('/login')
      }
    }
    checkSession()
  }, [])

  return null 
}
