import { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { fetchUserGroups, getUser, getMetricsLabels, fetchAllEntries, requestLogout } from '../../lib/queries'

export default function DashboardScreen() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any[]>([])
  const [entryTotals, setEntryTotals] = useState<{ [metricId: string]: { total: number, userTotal: number } }>({})

  const fetchGroupsAndMetrics = async () => {
      const user  = await getUser()
      const userGroupData = await fetchUserGroups(user)
      const fetchMetricsLabels = await getMetricsLabels(userGroupData.map(g => g.group_id))
      setMetrics(fetchMetricsLabels)
      setGroups(userGroupData.map(g => ({
        ...g.groups,
        metric: fetchMetricsLabels.find(m => m.group_id === g.group_id)
      })))
      const allEntries = await Promise.all(
      fetchMetricsLabels.map(async (metric) => {
      const entries = await fetchAllEntries(metric.id)
      const total = entries.reduce((sum, e) => sum + (e.amount || 0), 0)
      const userTotal = entries
        .filter(e => e.user_id === user?.id)
        .reduce((sum, e) => sum + (e.amount || 0), 0)
      return { metricId: metric.id, total, userTotal }
      })
      )
      const entryTotalsObj = Object.fromEntries(
      allEntries.map(e => [e.metricId, { total: e.total, userTotal: e.userTotal }])
      )
      setEntryTotals(entryTotalsObj)
      
      
      const groupIds = userGroupData?.map(g => g.group_id)
      if (!groupIds || groupIds.length === 0) {
        setLoading(false)
        return
      }
        setLoading(false)
    }
  const handleLogout = async () => {
    const error = await requestLogout()
    if (error) {
      return
    } else {
      setGroups([])
      setMetrics([])
      setEntryTotals({})
      router.replace('/login')
    }
  }

  useFocusEffect(
    useCallback(() => {
    console.log('Fetching groups and metrics...'),
    fetchGroupsAndMetrics()
  }, []))
 
  if (loading) {
    return <Text>Loading...</Text>
  }
  return (
    <View style={{ flex: 1, padding: 50, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Your Groups</Text>
          {groups.length === 0 && (
      <Text style={{ color: 'green', marginBottom: 20, marginTop: 10 }}>
        You are not tracking any groups yet. Tap "Browse Groups" below to find and track one!
      </Text>
    )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, marginBottom: 8, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => router.push(`/groups/${item.id}`)}>
              <View >
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: 'gray' }}>Metric: {item.metric?.name ?? 'no metric'} - {entryTotals[item.metric?.id]?.total} total {item.metric?.unit ?? ''}</Text>
                <Text style={{ color: 'gray' }}>👤 You: {entryTotals[item.metric?.id]?.userTotal} {item.metric?.unit ?? ''}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 8, padding: 8, backgroundColor: '#eee', borderRadius: 6 }}
              onPress={() => router.push(`entry/${item.metric?.id}`)}
              >
              <Text style={{ color: '#333', textAlign: 'left' }}>+ Add Entry</Text>
            </TouchableOpacity>
          </View>

      )}
      ListFooterComponent={
      <TouchableOpacity
        onPress={() => router.push('/groups')}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: 'black',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Browse Groups</Text>
      </TouchableOpacity>
      }></FlatList>
            <TouchableOpacity
        onPress={() => handleLogout()}
        style={{
          marginBottom: 30,
          padding: 12,
          backgroundColor: 'black',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center'
        }}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
