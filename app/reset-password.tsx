import { useEffect, useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setMessage(error.message)
    else {
      setMessage('Password reset successfully!')
      setNewPassword('')
      router.replace('/login')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Reset Password</Text>
      <TextInput
        placeholder='Enter new password'
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title='Update Password' onPress={handleResetPassword} />
      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  )
}