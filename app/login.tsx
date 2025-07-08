import { useEffect, useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import Constants from 'expo-constants' // dev only, delete for production

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isResettingPassword, setIsResettingPassword] = useState(false)

 // dev only, delete for production
  useEffect(() => {
  const loginUser = Constants.expoConfig?.extra?.DEVMAIL
  const loginPass = Constants.expoConfig?.extra?.DEVPASS
  // console.log('Using dev credentials:', loginUser, loginPass)
  if (loginUser && loginPass){
    setEmail(loginUser)
    setPassword(loginPass)
    setMessage('Using dev credentials, please change before production!')
  }
  }, [])
  // end dev only, delete for production

  useEffect(() => {
    const checkForResetToken = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const type = urlParams.get('type')
        if (token && type === 'reset') {
          setIsResettingPassword(true)
          setMessage('Please enter your new password.')
        }
      }
    }
    checkForResetToken()
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true)
        setMessage('Please enter your new password.')
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
 
    const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else {
        setMessage('Logged in!')
        router.replace('/(tabs)')
    }
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a confirmation link!')
  }

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link!')
  }

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setMessage(error.message)
    else {
      setMessage('Password reset successfully! ')
      setIsResettingPassword(false)
      setNewPassword('')
      router.replace('/(tabs)')
    }
  }

  return (
  <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: 'white' }}>
    {isResettingPassword ? (
      // Password Reset Form
      <>
        <Text style={{ color: 'black', fontSize: 18, marginBottom: 20 }}>Reset Password</Text>
        <Text style={{ color: 'black' }}>New Password</Text>
        <TextInput
          placeholder='Enter new password'
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8, color: 'black', backgroundColor: 'white' }}
          placeholderTextColor="#888"
        />
        <Button title='Update Password' onPress={handleResetPassword} />
        <Button title='Cancel' onPress={() => setIsResettingPassword(false)} />
      </>
    ) : (
      // Login Form
      <>
        <Text style={{ color: 'black' }}>Email</Text>
        <TextInput
          autoCapitalize='none'
          placeholder='email@example.com'
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8, color: 'black', backgroundColor: 'white' }}
          placeholderTextColor="#888"
        />
        <Text style={{ color: 'black' }}>Password</Text>
        <TextInput
          placeholder='password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8, color: 'black', backgroundColor: 'white' }}
          placeholderTextColor="#888"
        />
        <Button title='Sign In' onPress={handleLogin} />
        <Button title='Sign Up' onPress={handleSignup} />
        <Button title='Forgot Password' onPress={handleForgotPassword} />
      </>
    )}
    {message && <Text style={{ marginTop: 20, color: 'black' }}>{message}</Text>}
  </View>
)
}
