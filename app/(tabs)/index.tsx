import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'

export default function DashboardScreen() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('group_memberships')
        .select('group_id, groups ( id, name )')
        .eq('user_id', user?.id)

      if (error) console.error(error)
      else setGroups(data.map(g => g.groups))
      setLoading(false)
    }

    fetchGroups()
  }, [])
 
  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={{ flex: 1, padding: 50, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Your Groups</Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/groups/${item.id}`)}>
            <View style={{ padding: 12, borderWidth: 1, marginBottom: 8, borderRadius: 8 }}>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
      )}
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
        <Text style={{ color: 'white', textAlign: 'center' }}>+ Join or Create Group</Text>
      </TouchableOpacity>
      }></FlatList>
    </View>
  )
}
