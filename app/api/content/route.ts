import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/dal'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    const { db } = await connectToDatabase()
    
    // Viewers only see published content
    const filter = session.role === 'viewer' ? { status: 'published' } : {}
    
    const content = await db.collection('content')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    
    if (!['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { title, body, status } = await request.json()
    
    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    const content = {
      title,
      body,
      author: session.email,
      status: status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('content').insertOne(content)
    
    return NextResponse.json({ 
      ...content, 
      _id: result.insertedId.toString() 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}