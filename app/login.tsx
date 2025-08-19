import { useEffect, useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import Constants from 'expo-constants' // dev only, delete for production
import { addUser } from '@/lib/queries'
import { loginStyles } from '../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const styles = loginStyles
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const inputBg = useThemeColor({}, 'inputBackground')
  const borderColor = useThemeColor({}, 'border')

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
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'possibilism://reset-password' })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link!')
  }

  return (
  <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.label,{ color: textColor}]}>Email</Text>
        <TextInput
          autoCapitalize='none'
          placeholder='email@example.com'
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholderTextColor={borderColor}
        />
        <Text style={[styles.label, {color: textColor}]}>Password</Text>
        <TextInput
          placeholder='password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholderTextColor={borderColor}
        />
      <View style={styles.button}>
        <Button title='Sign In' onPress={handleLogin} />
      </View>
      <View style={styles.button}>
        <Button title='Sign Up' onPress={handleSignup} />
      </View>
      <View style={styles.button}>
        <Button title='Forgot Password' onPress={handleForgotPassword} />
      </View>
      {message && (
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      )}
    </View>
)
}
