'use client'

import Link from 'next/link'
import ContentManagement from './ContentManagement'
import DashboardLayout from './DashboardLayout'

interface Session {
  userId: string
  role: string
  email: string
}

export default function EditorDashboard({ session }: { session: Session }) {
  return (
    <DashboardLayout session={session} title="Editor Dashboard">
      <div className="space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editor Overview</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h4 className="text-lg font-medium text-gray-900">Content Management</h4>
                  <p className="mt-1 text-sm text-gray-500">Create, edit, and manage content</p>
                  <div className="mt-3">
                    <button 
                      onClick={() => {
                        const contentSection = document.getElementById('content-management')
                        contentSection?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium cursor-pointer"
                    >
                      Manage Content →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h4 className="text-lg font-medium text-gray-900">User Directory</h4>
                  <p className="mt-1 text-sm text-gray-500">View user information (read-only)</p>
                  <div className="mt-3">
                    <Link href="/dashboard/users" className="text-gray-600 hover:text-gray-500 text-sm font-medium">
                      View Users →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="content-management">
          <ContentManagement session={session} />
        </div>
      </div>
    </DashboardLayout>
  )
}
