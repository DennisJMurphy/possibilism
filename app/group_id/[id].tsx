import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'
import { checkIfTrackingGroup, getUser, startTrackingGroup, stopTrackingGroup } from '@/lib/queries'
import { Button } from 'react-native-elements'
import { groupStyles } from '../../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams() 
  const [group, setGroup] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<any[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const backgroundColor = useThemeColor({}, 'background')
  const cardBg = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const buttonBg = useThemeColor({}, 'buttonBackground')
  const buttonText = useThemeColor({}, 'buttonText')
  const descriptionColor = useThemeColor({}, 'descriptionText')

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
    
  }, [group?.id, userId])

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
    <View style={[groupStyles.container, { backgroundColor }]}>
      <Text style={[groupStyles.groupName, {color: textColor}]}>{group?.name}</Text>
      <Text style={[groupStyles.groupDescription, { color: descriptionColor }]}>{group?.description}</Text>
    {metrics.length === 0 ? (
        <Text>No metrics available for this group.</Text>
      ) : (
        <Text style={[groupStyles.header, {color: textColor}]}>Metrics:</Text>
      )}
      <FlatList
        data={metrics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
           onPress={() => router.push(`../metric_id/${item.id}`)}
            style={[groupStyles.groupCard, { backgroundColor: cardBg }]}
          >
            <Text style={[groupStyles.groupDescription, {color: textColor}]}>{item.name}</Text>
            <Text style={{ color: textColor }}>Unit: {item.unit}</Text>

          {entries.length>0? (<Text style={[groupStyles.groupDescription, {color: descriptionColor}]}>
            Total {metrics[0].name}: {entryTotal}
                </Text>): <Text style={[groupStyles.groupDescription, {color: descriptionColor}]}>tracking unavailable</Text>}
          </TouchableOpacity>
        )}
      />
    <Button
  title={isTracking ? "Stop Tracking Group" : "Track Group"}
    onPress={async () => {
      if (!userId || !group?.id) return
      if (isTracking) {
      await stopTrackingGroup(group.id, userId)
      setIsTracking(false)
      } else {
      await startTrackingGroup(group.id, userId)
      setIsTracking(true)
      }
  }}
  buttonStyle={[groupStyles.trackingButton, { backgroundColor: buttonBg }]}
  titleStyle={{ color: buttonText }}
/>
  
    </View>
  )
}
