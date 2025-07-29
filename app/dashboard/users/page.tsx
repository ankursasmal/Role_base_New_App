import { verifySession } from '../../lib/dal'
import { redirect } from 'next/navigation'
import DashboardLayout from '../../components/DashboardLayout'
import UserList from '@/components/UserList'
 
export default async function UsersPage() {
  const session = await verifySession()

  // Only admin and editor can access users page
  if (!['admin', 'editor'].includes(session.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout session={session} title="Users">
      <UserList session={session} />
    </DashboardLayout>
  )
}