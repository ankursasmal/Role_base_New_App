import ContentViewer from './ContentViewer'
import DashboardLayout from './DashboardLayout'
 
interface Session {
  userId: string
  role: string
  email: string
}

export default function ViewerDashboard({ session }: { session: Session }) {
  return (
    <DashboardLayout session={session} title="Viewer Dashboard">
      <div className="space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Access</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">Read-Only Access</h4>
                  <p className="mt-1 text-sm text-green-700">
                    You have viewer permissions. You can browse and read content but cannot make changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContentViewer session={session} />
      </div>
    </DashboardLayout>
  )
}
