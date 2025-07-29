import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '../../../lib/auth'
import { createSession } from '../../../lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await verifyUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    await createSession(user._id, user.role, user.email)

    return NextResponse.json({ 
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}