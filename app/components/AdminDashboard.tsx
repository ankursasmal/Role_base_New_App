import Link from 'next/link'
import DashboardLayout from './DashboardLayout'
import UserManagement from './UserManagement'
import SystemLogs from './SystemLogs'

interface Session {
  userId: string
  role: string
  email: string
}

interface AdminDashboardProps {
  session: Session
  users: any[]
  logs: any[]
}

export default function AdminDashboard({ session, users, logs }: AdminDashboardProps) {
  return (
    <DashboardLayout session={session} title="Admin Dashboard">
      <div className="space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Overview</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{users.length}</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">Manage all users</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{logs.length}</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">System Logs</dt>
                        <dd className="text-lg font-medium text-gray-900">Activity tracking</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">∞</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Full Access</dt>
                        <dd className="text-lg font-medium text-gray-900">All features</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserManagement users={users} />
        <SystemLogs logs={logs} />
      </div>
    </DashboardLayout>
  )
}
