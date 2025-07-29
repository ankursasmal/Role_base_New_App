import { verifySession } from '../lib/dal'
import ContentViewer from '../components/ContentViewer'
import DashboardLayout from '../components/DashboardLayout'

export default async function ContentPage() {
  const session = await verifySession()

  return (
    <DashboardLayout session={session} title="Content">
      <ContentViewer session={session} />
    </DashboardLayout>
  )
}