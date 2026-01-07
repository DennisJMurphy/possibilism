import { useEffect, useRef } from 'react'
import { router, useSegments, usePathname } from 'expo-router'
import { supabase } from '../lib/supabase'
import * as Linking from 'expo-linking'
import { useDeepLink } from './_layout'
import { logger } from '../lib/logger'

export default function Index() {
  const deepLinkUrl = useDeepLink()
  const segments = useSegments()
  const pathname = usePathname()
  const handledRef = useRef(false)

  useEffect(() => {
    logger.debug('Index route - segments:', segments, 'pathname:', pathname, 'handled:', handledRef.current)

    const handleDeepLink = async (url: string | null) => {
      if (!url || handledRef.current) return
        // Check if it's a reset-password deep link
      if (url.includes('reset-password')) {
        logger.info('Reset password deep link detected, redirecting...')
        handledRef.current = true
        router.replace('/reset-password')
        return
      }
      if (url.includes('#access_token=')) {
        logger.debug('Deep link contains session tokens, parsing...')
        const fragment = url.split('#')[1]
        const params = new URLSearchParams(fragment)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        if (accessToken && refreshToken && type === 'recovery') {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            if (!error) {
              logger.info('Session set successfully, redirecting to reset-password')
              handledRef.current = true
              router.replace('/reset-password')
              return
            } else {
              logger.error('Error setting session:', error)
            }
          } catch (err) {
            logger.error('Exception setting session:', err)
          }
        }
      }
    }

    const checkSessionAndHandleDeepLink = async () => {
      if (segments.length > 0 || pathname !== '/') {
        logger.debug('User is on a specific route, not redirecting')
        return
      }
      const url = await Linking.getInitialURL()
      logger.debug('Initial URL:', url, 'DeepLinkContext URL:', deepLinkUrl)
      await handleDeepLink(deepLinkUrl || url)
      if (handledRef.current) return

      logger.debug('Checking session for initial navigation')
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        logger.info('User has session, redirecting to tabs')
        router.replace('/(tabs)')
      } else {
        if (!handledRef.current){
        logger.info('No session, redirecting to login')
        router.replace('/login')
        }

      }
    }

    // Listen for deep link events
    const subscription = Linking.addEventListener('url', event => {
      logger.debug('Deep link event received:', event.url)
      handleDeepLink(event.url)
    })

    const timer = setTimeout(checkSessionAndHandleDeepLink, 300)
    return () => {
      clearTimeout(timer)
      subscription.remove()
    }
  }, [deepLinkUrl,segments, pathname])

  return null
}
