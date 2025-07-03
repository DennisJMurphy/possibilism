import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'
import { checkIfTrackingGroup, getUser, startTrackingGroup, stopTrackingGroup } from '@/lib/queries'
import { Button } from 'react-native-elements'

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams() 
  const [group, setGroup] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<any[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroup = async () => {
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

      setGroup(groupData)
      setLoading(false)
    }

    fetchGroup()
  }, [id])

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: metricsData } = await supabase
        .from('metrics')
        .select('*')
        .eq('group_id', group?.id)

      setMetrics(metricsData || [])
    }

    fetchMetrics()
    
  }, [group?.id])

  useEffect(() => {
    const checkIfTracking = async () => {
      const user = await getUser()
      setUserId(user?.id || null)

      if (!group?.id) return
      if (!user?.id) {
        setIsTracking(false)
        return
      }

      const isTracking = await checkIfTrackingGroup(group.id, user?.id)
      setIsTracking(isTracking)    
    }
    checkIfTracking()
    
  }, [group?.id])

  useEffect(() => {
    const fetchEntries = async () => {
      if (!metrics.length) return
      const { data: entriesData } = await supabase
        .from('entries')
        .select('amount')
        .eq('metric_id', metrics[0]?.id)
      setEntries(entriesData || [])
    }
    fetchEntries()
  }, [metrics])


  if (loading) return <Text>Loading group...</Text>
  if (!group) return <Text>Group not found</Text>
  let entryTotal = 0
  if (entries.length > 0) {
    entryTotal = entries.reduce((total, entry) => total + entry.amount, 0)
  }

  return (
    <View style={{ flex: 1, padding: 100 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{group?.name}</Text>
      <Text style={{ fontSize: 14, marginBottom: 12 }}>{group?.description}</Text>
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

          {entries.length>0? (<Text style={{ fontSize: 16, marginTop: 20 }}>
            Total {metrics[0].name}: {entryTotal}
                </Text>): <Text style={{ fontSize: 16, marginBottom: 12 }}>tracking unavailable</Text>}
          </TouchableOpacity>
        )}
      />
    <Button
  title={isTracking ? "Stop Tracking Group" : "Track Group"}
  onPress={async () => {
    if (!userId || !group?.id) return
    if (isTracking) {
      // Remove tracking
      await stopTrackingGroup(group.id, userId)
      setIsTracking(false)
    } else {
      // Add tracking
      await startTrackingGroup(group.id, userId)
      setIsTracking(true)
    }
  }}
/>
  
    </View>
  )
}
