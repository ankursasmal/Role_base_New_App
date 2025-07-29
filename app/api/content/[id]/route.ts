import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/dal'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    
    if (!['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    const { title, body, status } = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          body, 
          status,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Content updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    
    if (!['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()
    
    const result = await db.collection('content').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
