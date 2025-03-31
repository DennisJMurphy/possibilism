import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('')
  const [metricName, setMetricName] = useState('')
  const [unit, setUnit] = useState('')

  const handleCreateGroup = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Alert.alert('Error', 'You must be logged in')

    // 1. Create the group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name: groupName, creator_id: user.id })
      .select()
      .single()

    if (groupError) return Alert.alert('Group error', groupError.message)

    // 2. Add current user to group_memberships
    const { error: membershipError } = await supabase
      .from('group_memberships')
      .insert({ group_id: group.id, user_id: user.id, role: 'admin' })
    if (membershipError) {
        console.error("membership error", membershipError.message)
        return Alert.alert('Membership error', membershipError.message)
    }
        


    // 3. Add metric to the new group
    const { error: metricError } = await supabase
      .from('metrics')
      .insert({ name: metricName, unit, group_id: group.id })

    if (metricError) return Alert.alert('Metric error', metricError.message)

    // 4. Go to group detail page
    // router.replace(`/groups/${group.id}`)
    router.replace('/(tabs)')
  }

  return (
    <View style={{ padding:40, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Create a New Group</Text>

      <Text>Group Name</Text>
      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder="e.g. Trash Collectors"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>First Metric</Text>
      <TextInput
        value={metricName}
        onChangeText={setMetricName}
        placeholder="e.g. Kilos of Trash"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Unit (e.g. kg, km)</Text>
      <TextInput
        value={unit}
        onChangeText={setUnit}
        placeholder="e.g. kg"
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  )
}
