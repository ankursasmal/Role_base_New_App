'use server'

import { redirect } from 'next/navigation'
import { verifyUser, createUser } from '../lib/auth'
import { createSession, deleteSession } from '../lib/session'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const user = await verifyUser(email, password)
    
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    await createSession(user._id, user.role, user.email)
    redirect('/dashboard')
  } catch (error) {
    return { error: 'Login failed. Please try again.' }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    return { error: 'All fields are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  try {
    const user = await createUser({ 
      email, 
      password, 
      name, 
      role: 'viewer' // Default role for new signups
    })
    
    await createSession(user._id, user.role, user.email)
    redirect('/dashboard')
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return { error: 'User already exists' }
    }
    return { error: 'Signup failed. Please try again.' }
  }
}
