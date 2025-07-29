import { verifySession } from '../../lib/dal'
import { redirect } from 'next/navigation'
import DashboardLayout from '../../components/DashboardLayout'
import ContentManagement from '../../components/ContentManagement'

export default async function ContentPage() {
  const session = await verifySession()

  // Only admin and editor can access content management
  if (!['admin', 'editor'].includes(session.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout session={session} title="Content Management">
      <ContentManagement session={session} />
    </DashboardLayout>
  )
}