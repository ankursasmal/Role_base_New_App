import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
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
      user: { id: user._id, email: user.email, role: user.role, name: user.name }
    })
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }
    
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}