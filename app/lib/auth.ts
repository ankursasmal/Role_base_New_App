import bcrypt from 'bcryptjs'
import { connectToDatabase } from './db'

export interface User {
  _id?: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
  name: string
  createdAt: Date
  lastLogin?: Date
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt'>) {
  try {
    const { db } = await connectToDatabase()
    
    const existingUser = await db.collection('users').findOne({ email: userData.email })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const user = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date()
    }

    const result = await db.collection('users').insertOne(user)
    return { ...user, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function verifyUser(email: string, password: string) {
  try {
    const { db } = await connectToDatabase()
    
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return null
    }

    // Update last login
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    )

    return {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
  } catch (error) {
    console.error('Error verifying user:', error)
    return null
  }
}
