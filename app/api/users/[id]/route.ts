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
    
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    
    if (id === session.userId) {
      return NextResponse.json({ error: 'Cannot modify your own role' }, { status: 400 })
    }

    const { role, name, email } = await request.json()
    const { db } = await connectToDatabase()

    const updateData: any = {}
    if (role) updateData.role = role
    if (name) updateData.name = name
    if (email) updateData.email = email
    updateData.updatedAt = new Date()

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await db.collection('system_logs').insertOne({
      userId: new ObjectId(session.userId),
      action: `Updated user ${id} - ${role ? `role to ${role}` : 'profile'}`,
      timestamp: new Date(),
      details: `User role updated by ${session.email}`
    })

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    
    if (id === session.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const userToDelete = await db.collection('users').findOne({ _id: new ObjectId(id) })
    
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await db.collection('system_logs').insertOne({
      userId: new ObjectId(session.userId),
      action: `Deleted user ${userToDelete.email}`,
      timestamp: new Date(),
      details: `User deleted by ${session.email}`
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
