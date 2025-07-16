import { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import { supabase } from '../lib/supabase'
import { router} from 'expo-router'
import { loginStyles } from '../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const styles = loginStyles
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const inputBg = useThemeColor({}, 'inputBackground')
  const borderColor = useThemeColor({}, 'border')

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
      <Button title='Update Password' onPress={handleResetPassword} />
      {message ? <Text style={[styles.message, { color: textColor }]}>{message}</Text> : null}
    </View>
  )
}