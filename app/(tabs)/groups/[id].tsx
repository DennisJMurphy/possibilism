import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams() 
  const [group, setGroup] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroupAndMetrics = async () => {
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

      const { data: metricsData } = await supabase
        .from('metrics')
        .select('*')
        .eq('group_id', id)

      setGroup(groupData)
      setMetrics(metricsData || [])
      setLoading(false)
    }

    fetchGroupAndMetrics()
  }, [id])

  if (loading) return <Text>Loading group...</Text>

  return (
    <View style={{ flex: 1, padding: 50 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{group?.name}</Text>
    {metrics.length === 0 ? (
        <Text>No metrics available for this group.</Text>
      ) : (
        <Text style={{ fontSize: 16, marginBottom: 12 }}>Metrics:</Text>
      )}
      <FlatList
        data={metrics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
           onPress={() => router.push(`/entry/${item.id}`)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 10
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text style={{ color: 'gray' }}>Unit: {item.unit}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
