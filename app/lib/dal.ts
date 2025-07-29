import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { decrypt } from './session'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { 
    isAuth: true, 
    userId: session.userId,
    role: session.role,
    email: session.email
  }
})

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)
  
  return session ? {
    userId: session.userId,
    role: session.role,
    email: session.email
  } : null
})
