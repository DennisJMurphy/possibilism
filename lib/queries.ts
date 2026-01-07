import { supabase } from './supabase'
import { logger } from './logger'

export async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        logger.error('Error fetching user:', error)
        return null
    }
        return user    
}

export async function fetchUserGroups(user: { id: any } | null) {
  const { data, error } = await supabase
    .from('group_memberships')
    .select('group_id, groups ( id, name )')
    .eq('user_id', user?.id)

  if (error) {
    logger.error('Error fetching groups:', error)
    return []
  }
  
  return data || []
}

export async function getMetricsLabels(groupIds: string[]) {
  const { data, error } = await supabase
    .from('metrics')
    .select('id, name, unit, group_id')
    .in('group_id', groupIds)

  if (error) {
    logger.error('Error fetching metrics:', error)
    return []
  }

  return data || []
}

export async function fetchAllEntries (metricIds: string[]) {
  const { data, error } = await supabase
    .from('entries')
    .select('amount, user_id')
    .eq('metric_id', metricIds)

  if (error) {
    logger.error('Error fetching entries:', error)
    return []
  }

  return data || []
}
export async function checkIfTrackingGroup(groupId: string, userId: string) {
    if (!groupId || !userId) {
        logger.error('Invalid groupId or userId')
        return false
    }
    const { data, error } = await supabase
        .from('group_memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('group_id', groupId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows") {
        logger.error('Error checking tracking status:', error)
        return false
    }
    if (!data) {
        logger.debug('User is not tracking this group')
        return false
    }
    if (data.id) {
        logger.debug('User is tracking this group')
        return true
    }

  return false
}

export async function stopTrackingGroup(groupId: string, userId: string) {
    logger.debug('Stopping tracking for group:', groupId, 'and user:', userId)
    if (!groupId || !userId) {
        logger.error('Invalid groupId or userId')
        return
    }
    const { error } = await supabase
        .from('group_memberships')
        .delete()
        .eq('user_id', userId)
        .eq('group_id', groupId)

    if (error) {
        logger.error('Error stopping tracking:', error)
    } else {
        logger.info('Successfully stopped tracking group')
    }
}
export async function startTrackingGroup(groupId: string, userId: string) {
    if (await checkIfTrackingGroup(groupId, userId)) {
        logger.debug('Already tracking this group')
        return
    }
    if (!groupId || !userId) {
        logger.error('Invalid groupId or userId')
        return
    }
    const { error } = await supabase
        .from('group_memberships')
        .insert({ user_id: userId, group_id: groupId })

    if (error) {
        logger.error('Error starting tracking:', error)
    } else {
        logger.info('Successfully started tracking group')
    }
}

export const requestLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      logger.error('Error signing out:', error)
      return error
    } 
    return null
  }

export async function addUser(email: string, password: string) {
    if (!email || !password) {
        logger.error('Email and password are required')
        return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
        logger.error('Error signing up:', error.message)
        return null
    }
    return !!data
}
