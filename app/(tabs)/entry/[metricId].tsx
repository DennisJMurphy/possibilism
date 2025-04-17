import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../../../lib/supabase'

export default function EntryFormScreen() {
  const { metricId } = useLocalSearchParams()
  const [metric, setMetric] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

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
      router.replace(`/groups/${metric.group_id}`)
    }
  }

  if (!metric) {
    return <Text>Loading metric...</Text>
  }

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        Log your {metric.name} ({metric.unit})
      </Text>

      <TextInput
        placeholder={`e.g. 2.5`}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Optional note (e.g. Beach cleanup)"
        value={note}
        onChangeText={setNote}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Button title="Save Entry" onPress={handleSubmit} />
    </View>
  )
}
