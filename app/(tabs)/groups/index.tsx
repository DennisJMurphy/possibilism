import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'
import { groupStyles } from '../../../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function BrowseGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const backgroundColor = useThemeColor({}, 'background')
  const cardBg = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const buttonBg = useThemeColor({}, 'buttonBackground')
  const buttonText = useThemeColor({}, 'buttonText')
  const descriptionColor = useThemeColor({}, 'descriptionText')

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
      if (error) console.error(error)
      else setGroups(data || [])
      setLoading(false)
    }
    fetchGroups()
  }, [])

  if (loading) return <Text>Loading groups...</Text>

  return (
    <View style={[groupStyles.container, { backgroundColor }]}>
      <Text style={[groupStyles.header, {color: textColor}]}>Browse Groups</Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`../../group_id/${item.id}`)}>
            <View style={[groupStyles.groupCard, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[groupStyles.groupName, { color: textColor }]}>{item.name}</Text>
              {item.description && (
                <Text style={[groupStyles.groupDescription, {color: descriptionColor}]}>{item.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => router.push('/create-group')}
            style={[groupStyles.footerButton, { backgroundColor: buttonBg }]}
          >
          <Text style={[groupStyles.footerButtonText, { color: buttonText}]}>+ Create New Group</Text>
          </TouchableOpacity>
        }
         />
    </View>
  )
}
