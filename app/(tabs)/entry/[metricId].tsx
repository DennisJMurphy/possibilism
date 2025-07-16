import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { groupStyles } from '../../../constants/Styles'
import { loginStyles } from '../../../constants/Styles' 
import { useThemeColor } from '@/hooks/useThemeColor'

export default function EntryFormScreen() {
  const { metricId } = useLocalSearchParams()
  const [metric, setMetric] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const buttonBg = useThemeColor({}, 'buttonBackground')
  const buttonText = useThemeColor({}, 'buttonText')
  const descriptionColor = useThemeColor({}, 'descriptionText')

  useEffect(() => {
    const fetchMetric = async () => {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('id', metricId)
        .single()

      if (error) {
        console.error(error)
        Alert.alert('Error', 'Could not load metric.')
      } else {
        setMetric(data)
      }
    }

    fetchMetric()
  }, [metricId])

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !metric) return

    const { error } = await supabase
      .from('entries')
      .insert({
        metric_id: metric.id,
        user_id: user.id,
        amount: parseFloat(amount),
        note
      })

    if (error) {
      console.error(error)
      Alert.alert('Error', 'Could not save entry.')
    } else {
      setAmount('')
      setNote('')
      Alert.alert('Success', 'Entry saved successfully!')
      router.replace(`/groups/${metric.group_id}`)
    }
  }

  if (!metric) {
    return <Text>Loading metric...</Text>
  }

  return (
    <View style={[groupStyles.container, { backgroundColor }]}>
      <Text style={[groupStyles.header, { color: textColor }]}>
        Log your {metric.name} ({metric.unit})
      </Text>

      <TextInput
        placeholder={`e.g. 2.5`}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />

      <TextInput
        placeholder="Optional note (e.g. Beach cleanup)"
        value={note}
        onChangeText={setNote}
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />

      <Button title="Save Entry" onPress={handleSubmit} />
    </View>
  )
}
