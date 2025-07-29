import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/dal'
import { connectToDatabase } from '@/lib/db'
import { createUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    
    // Only admin and editor can view users
    if (!['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { db } = await connectToDatabase()
    
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } }) // Exclude password field
      .sort({ createdAt: -1 })
      .toArray()

    const serializedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null
    }))

    return NextResponse.json(serializedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    
    // Only admin can create users
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { email, password, name, role = 'viewer' } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const user = await createUser({ email, password, name, role })

    return NextResponse.json({ 
      message: 'User created successfully',
      user: { 
        _id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
