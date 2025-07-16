import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor'
import { groupStyles } from '../../constants/Styles'
import { loginStyles } from '../../constants/Styles'

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('')
  const [metricName, setMetricName] = useState('')
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')

  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const descriptionColor = useThemeColor({}, 'descriptionText')

  const handleCreateGroup = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Alert.alert('Error', 'You must be logged in')

    // 1. Create the group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name: groupName, creator_id: user.id, description })
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

    // 4. Confirm success and clear inputs
    Alert.alert('Success', 'Group created successfully')
    setGroupName('')
    setMetricName('')
    setUnit('')

    // 5. Navigate to the dashboard
    router.replace('/(tabs)')
  }

  return (
    <View style={[groupStyles.container, { backgroundColor }]}>
      <Text style={[groupStyles.header, {color: textColor}]}>Create a New Group</Text>

      <Text style={[groupStyles.groupName, {color: textColor}]}>Group Name</Text>
      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder="e.g. Trash Collectors"
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />

      <Text style={[groupStyles.groupName, {color: textColor}]}>First Metric</Text>
      <TextInput
        value={metricName}
        onChangeText={setMetricName}
        placeholder="e.g. Kilos of Trash"
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />

      <Text style={[groupStyles.groupName, {color: textColor}]}>Unit (e.g. kg, km)</Text>
      <TextInput
        value={unit}
        onChangeText={setUnit}
        placeholder="e.g. kg"
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />

      <Text style={[groupStyles.groupName, {color: textColor}]}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="We're a group dedicated to cleaning up our local beaches."
        style={[loginStyles.input, { borderColor, color: textColor }]}
        placeholderTextColor={descriptionColor}
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  )
}
