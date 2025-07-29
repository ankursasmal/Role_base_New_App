'use server'

import { verifySession } from '../lib/dal'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '../lib/db'
import { ObjectId } from 'mongodb'

export async function getUsersForAdmin() {
  const session = await verifySession()
  
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { db } = await connectToDatabase()
      
      const users = await db.collection('users')
        .find({}, { projection: { password: 0 } })
        .toArray()

      return users.map((user: any) => ({
        ...user,
        _id: user._id.toString()
      }))
    } catch (error: any) {
      console.error(`Attempt ${attempt} - Error fetching users:`, error.message)
      
      if (attempt === 3) {
        console.error('Failed to fetch users after 3 attempts')
        return []
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  return []
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await verifySession()
  
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole })
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to update user role' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { error: 'Failed to update user role' }
  }
}

export async function deleteUser(userId: string) {
  const session = await verifySession()
  
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to delete user' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: 'Failed to delete user' }
  }
}

export async function getSystemLogs() {
  const session = await verifySession()
  
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { db } = await connectToDatabase()
      
      const logs = await db.collection('system_logs')
        .find({})
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()

      return logs.map(log => ({
        ...log,
        _id: log._id.toString(),
        timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp
      }))
    } catch (error: any) {
      console.error(`Attempt ${attempt} - Error fetching system logs:`, error.message)
      
      if (attempt === 3) {
        console.error('Failed to fetch system logs after 3 attempts')
        return []
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  return []
}

async function logActivity(userId: string, action: string) {
  let retries = 3
  while (retries > 0) {
    try {
      const { db } = await connectToDatabase()
      await db.admin().ping()
      
      await db.collection('activity_logs').insertOne({
        userId,
        action,
        timestamp: new Date()
      })
      return
    } catch (error) {
      console.error('Error logging activity:', error)
      retries--
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000))
      }
    }
  }
}
