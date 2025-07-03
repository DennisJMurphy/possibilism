import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'

export default function BrowseGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    <View style={{ padding: 50

     }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Browse Groups</Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/groups/${item.id}`)}>
            <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
              {item.description && (
                <Text style={{ color: 'gray', marginTop: 4 }}>{item.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

ListFooterComponent={
<TouchableOpacity
  onPress={() => router.push('/create-group')}
  style={{
    marginTop: 20,
    padding: 12,
    backgroundColor: 'black',
    borderRadius: 8,
  }}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>+ Create New Group</Text>
</TouchableOpacity>
}
    </View>
  )
}
