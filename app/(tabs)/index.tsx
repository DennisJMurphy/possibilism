import { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { fetchUserGroups, getUser, getMetricsLabels, fetchAllEntries, requestLogout } from '../../lib/queries'
import { groupStyles } from '../../constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function DashboardScreen() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any[]>([])
  const [entryTotals, setEntryTotals] = useState<{ [metricId: string]: { total: number, userTotal: number } }>({})

  const backgroundColor = useThemeColor({}, 'background')
  const cardBg = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const buttonBg = useThemeColor({}, 'buttonBackground')
  const buttonText = useThemeColor({}, 'buttonText')
  const descriptionColor = useThemeColor({}, 'descriptionText')


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
    <View style={[groupStyles.container, { backgroundColor }]}>
      <Text style={[groupStyles.header, { color: textColor}]}>Your Groups</Text>
          {groups.length === 0 && (
      <Text style={{ color: descriptionColor, marginBottom: 20, marginTop: 10 }}>
        You are not tracking any groups yet. Tap "Browse Groups" below to find and track one!
      </Text>
    )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
          <View style={[groupStyles.groupCard, { backgroundColor: cardBg, borderColor }]}>
            <TouchableOpacity onPress={() => router.push(`/groups/${item.id}`)}>
              <View >
                <Text style={[groupStyles.groupName, { color: textColor }]}>{item.name}</Text>
                <Text style={{ color: descriptionColor}}>Metric: {item.metric?.name ?? 'no metric'} - {entryTotals[item.metric?.id]?.total} total {item.metric?.unit ?? ''}</Text>
                <Text style={{ color: descriptionColor}}>👤 You: {entryTotals[item.metric?.id]?.userTotal} {item.metric?.unit ?? ''}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 8, padding: 8, backgroundColor: buttonBg, borderRadius: 6 }}
              onPress={() => router.push(`entry/${item.metric?.id}`)}
              >
              <Text style={{ color: buttonText, textAlign: 'left' }}>+ Add Entry</Text>
            </TouchableOpacity>
          </View>

      )}
      ListFooterComponent={
      <TouchableOpacity
        onPress={() => router.push('/groups')}
        style={[groupStyles.footerButton, { backgroundColor: buttonBg }]}
      >
        <Text style={[groupStyles.footerButtonText, { color: buttonText}]}>Browse Groups</Text>
      </TouchableOpacity>
      }
      />

      <TouchableOpacity
        onPress={() => handleLogout()}
        style={[groupStyles.logoutButton, { backgroundColor: buttonBg }]}>
        <Text style={[groupStyles.footerButtonText, { color: buttonText }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
