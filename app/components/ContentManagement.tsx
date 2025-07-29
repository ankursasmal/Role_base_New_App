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

export default function ContentManagement({ session }: { session: Session }) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [newContent, setNewContent] = useState({ 
    title: '', 
    body: '', 
    status: 'draft' as 'draft' | 'published' 
  })

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingContent ? `/api/content/${editingContent._id}` : '/api/content'
      const method = editingContent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      })

      if (response.ok) {
        await fetchContent()
        setNewContent({ title: '', body: '', status: 'draft' })
        setShowForm(false)
        setEditingContent(null)
      }
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  const handleEdit = (content: Content) => {
    setEditingContent(content)
    setNewContent({
      title: content.title,
      body: content.body,
      status: content.status
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return
    
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchContent()
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
    }
  }

  const canEdit = session.role === 'admin' || session.role === 'editor'

  if (loading) {
    return <div className="bg-white shadow rounded-lg p-6">Loading...</div>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Content Management</h3>
        {canEdit && (
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingContent(null)
              setNewContent({ title: '', body: '', status: 'draft' })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {showForm ? 'Cancel' : 'Create Content'}
          </button>
        )}
      </div>

      {showForm && canEdit && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={newContent.body}
                onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={newContent.status}
                onChange={(e) => setNewContent({ ...newContent, status: e.target.value as 'draft' | 'published' })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {editingContent ? 'Update Content' : 'Save Content'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {contents.map((content) => (
          <div key={content._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{content.title}</h4>
                <p className="mt-1 text-gray-600">{content.body}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>By {content.author}</span>
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    content.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {content.status}
                  </span>
                </div>
              </div>
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(content._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No content available. Create your first post!</p>
        </div>
      )}
    </div>
  )
}
