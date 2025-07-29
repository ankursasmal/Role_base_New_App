import { verifySession } from '../lib/dal'
import AdminDashboard from '../components/AdminDashboard'
import EditorDashboard from '../components/EditorDashboard'
import ViewerDashboard from '../components/ViewerDashboard'
import { getUsersForAdmin, getSystemLogs } from '../actions/admin'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (session.role === 'admin') {
    const [users, logs] = await Promise.all([
      getUsersForAdmin(),
      getSystemLogs()
    ])
    return <AdminDashboard session={session} users={users} logs={logs} />
  } else if (session.role === 'editor') {
    return <EditorDashboard session={session} />
  } else if (session.role === 'viewer') {
    return <ViewerDashboard session={session} />
  } else {
    redirect('/login')
  }
}
