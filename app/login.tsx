import { useState } from 'react'
import { View, TextInput, Button, Text, Image, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
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
  const linkColor = useThemeColor({}, 'tint')

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
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
        />
        <Text style={[styles.title, { color: textColor }]}>Let's track good deeds!</Text>
        
        <Text style={[styles.label, { color: textColor }]}>Email</Text>
        <TextInput
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='email@example.com'
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
          placeholderTextColor={borderColor}
        />
        <Text style={[styles.label, { color: textColor }]}>Password</Text>
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
      
      <View style={styles.linkContainer}>
        <Text style={{ color: textColor }}>New here? </Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={[styles.link, { color: linkColor }]}>Create</Text>
        </TouchableOpacity>
        <Text style={{ color: textColor }}> an account</Text>
      </View>
      
      <View style={styles.linkContainer}>
        <Text style={{ color: textColor }}>Forgot your </Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.link, { color: linkColor }]}>password</Text>
        </TouchableOpacity>
        <Text style={{ color: textColor }}>?</Text>
      </View>

      {message && (
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      )}
    </View>
)
}
