'use client'

interface LogEntry {
  _id: string
  level: string
  message: string
  timestamp: string
  userId?: string
}

interface SystemLogsProps {
  logs: LogEntry[]
}

export default function SystemLogs({ logs }: SystemLogsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent System Logs</h3>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log._id} className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.level === 'error' ? 'bg-red-100 text-red-800' :
                      log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {log.level}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{log.message}</p>
                    <p className="text-xs text-blue-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No system logs available</p>
          )}
        </div>
      </div>
    </div>
  )
}
