import { useEffect, useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import Constants from 'expo-constants' // dev only, delete for production
import { addUser } from '@/lib/queries'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

 // dev only, delete for production
  useEffect(() => {
  const loginUser = Constants.expoConfig?.extra?.DEVMAIL
  const loginPass = Constants.expoConfig?.extra?.DEVPASS
  if (loginUser && loginPass){
    setEmail(loginUser)
    setPassword(loginPass)
    setMessage('Using dev credentials, please change before production!')
  }
  }, [])
  // end dev only, delete for production

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else {
        setMessage('Logged in!')
        router.replace('/(tabs)')
    }
  }

  const handleSignup = async () => {
    const addUserConfirmation = await addUser(email, password)
    if (addUserConfirmation) {
      setMessage('User already exists with this email.')
      return
    }
    setMessage('Check your email for a confirmation link!')
  }

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link!')
  }

  return (
  <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: 'white' }}>
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
    
    {message && <Text style={{ marginTop: 20, color: 'black' }}>{message}</Text>}
  </View>
)
}
