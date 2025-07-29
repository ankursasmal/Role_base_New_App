import { logout } from "@/actions/auth";

 
interface Props {
  children: React.ReactNode
  session: { userId: string; role: string; email: string }
  title: string
}

export default function DashboardLayout({ children, session, title }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-6">
                {session.role === 'admin' && (
                  <>
                    <a href="/dashboard/users" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      User Management
                    </a>
                    <a href="/dashboard/logs" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      System Logs
                    </a>
                    <a href="/dashboard/content" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Content
                    </a>
                  </>
                )}
                {session.role === 'editor' && (
                  <>
                    <a href="/dashboard/content" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Content Management
                    </a>
                    <a href="/dashboard/users" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                      Users (View Only)
                    </a>
                  </>
                )}
                {session.role === 'viewer' && (
                  <a href="/dashboard/content" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    View Content
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{session.email}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  session.role === 'admin' ? 'bg-red-100 text-red-800' :
                  session.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {session.role.charAt(0).toUpperCase() + session.role.slice(1)}
                </span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
