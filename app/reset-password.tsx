import { useState, useEffect } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { supabase } from '../lib/supabase'
import { router, useLocalSearchParams } from 'expo-router'
import { loginStyles } from '../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { logger } from '../lib/logger'

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const params = useLocalSearchParams()

  const styles = loginStyles
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const inputBg = useThemeColor({}, 'inputBackground')
  const borderColor = useThemeColor({}, 'border')

  useEffect(() => {
    logger.debug('Reset password screen mounted with params:', params)
    
    // Handle deep link session recovery
    const handleDeepLink = async () => {
      // Check if user already has a valid session (set by index.tsx)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        logger.info('Valid session found, user can reset password')
        setMessage('You can now enter your new password.')
        return
      }

      // Handle direct token from email link
      if (params.token && params.type === 'recovery') {
        logger.debug('Processing recovery token:', params.token)
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: params.token as string,
            type: 'recovery'
          })
          if (error) {
            logger.error('Token verification error:', error)
            setMessage('Invalid or expired reset link. Please request a new one.')
          } else {
            logger.info('Token verified successfully:', data)
            setMessage('Reset link verified! You can now enter your new password.')
          }
        } catch (error) {
          logger.error('Token verification exception:', error)
          setMessage('Error processing reset link.')
        }
      }
      // Handle session tokens (if Supabase redirects with them)
      else if (params.access_token && params.refresh_token) {
        logger.debug('Processing session tokens')
        try {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string
          })
          if (error) {
            logger.error('Session error:', error)
            setMessage('Invalid reset link. Please request a new one.')
          } else {
            logger.info('Session set successfully')
            setMessage('You can now enter your new password.')
          }
        } catch (error) {
          logger.error('Session exception:', error)
          setMessage('Error processing reset link.')
        }
      } else {
        logger.warn('No tokens found in params and no valid session')
        setMessage('Please use a valid reset link to access this page.')
      }
    }

    handleDeepLink()
  }, [params])

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password.')
      return
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Password reset successfully!')
        setTimeout(() => {
          router.replace('/login')
        }, 2000)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label,{ color: textColor}]}>Reset Password</Text>
      <TextInput
        placeholder='Enter new password'
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
        style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
        placeholderTextColor={borderColor}
      />
      <Button 
        title={isLoading ? 'Updating...' : 'Update Password'} 
        onPress={handleResetPassword}
        disabled={isLoading}
      />
      {message ? <Text style={[styles.message, { color: textColor }]}>{message}</Text> : null}
    </View>
  )
}