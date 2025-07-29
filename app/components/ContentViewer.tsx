'use client'
import { useState, useEffect } from 'react'

interface Session {
  userId: string
  role: string
  email: string
}

interface Content {
  _id: string
  title: string
  body: string
  author: string
  createdAt: string
  status: 'draft' | 'published'
}

export default function ContentViewer({ session }: { session: Session }) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Available Content</h3>
      
      <div className="space-y-6">
        {contents.map((content) => (
          <article key={content._id} className="border border-gray-200 rounded-lg p-6">
            <header className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{content.title}</h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>By {content.author}</span>
                <span>{isClient ? new Date(content.createdAt).toLocaleDateString() : 'Loading...'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  content.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {content.status}
                </span>
              </div>
            </header>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{content.body}</p>
            </div>
          </article>
        ))}
      </div>
      
      {contents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No content available at the moment.</p>
        </div>
      )}
    </div>
  )
}
