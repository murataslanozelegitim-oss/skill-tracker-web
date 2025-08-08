import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get pending sync items for the user
    const syncItems = await db.syncQueue.findMany({
      where: {
        userId: userId,
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ syncItems })
  } catch (error) {
    console.error('Error fetching sync items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, syncItems } = await request.json()
    
    if (!userId || !syncItems) {
      return NextResponse.json({ error: 'User ID and sync items required' }, { status: 400 })
    }

    const results = []
    
    for (const item of syncItems) {
      try {
        // Process the sync item based on action type
        switch (item.action) {
          case 'CREATE_OBSERVATION':
            const observation = await db.observation.create({
              data: {
                studentId: item.data.studentId,
                teacherId: userId,
                date: new Date(item.data.date),
                time: item.data.time,
                activityType: item.data.activityType,
                observedSkills: item.data.observedSkills,
                initiator: item.data.initiator,
                studentResponse: item.data.studentResponse,
                isGoalAligned: item.data.isGoalAligned,
                notes: item.data.notes,
                tags: item.data.tags,
                environment: item.data.environment || 'CLASSROOM'
              }
            })
            results.push({ id: item.id, success: true, data: observation })
            break
            
          case 'UPDATE_OBSERVATION':
            const updatedObservation = await db.observation.update({
              where: { id: item.data.id },
              data: {
                date: new Date(item.data.date),
                time: item.data.time,
                activityType: item.data.activityType,
                observedSkills: item.data.observedSkills,
                initiator: item.data.initiator,
                studentResponse: item.data.studentResponse,
                isGoalAligned: item.data.isGoalAligned,
                notes: item.data.notes,
                tags: item.data.tags,
                environment: item.data.environment
              }
            })
            results.push({ id: item.id, success: true, data: updatedObservation })
            break
            
          case 'DELETE_OBSERVATION':
            await db.observation.delete({
              where: { id: item.data.id }
            })
            results.push({ id: item.id, success: true })
            break
            
          default:
            results.push({ id: item.id, success: false, error: 'Unknown action type' })
        }
        
        // Mark sync item as completed
        await db.syncQueue.update({
          where: { id: item.id },
          data: { status: 'COMPLETED', syncedAt: new Date() }
        })
        
      } catch (error) {
        console.error(`Error processing sync item ${item.id}:`, error)
        
        // Mark as failed and increment retry count
        await db.syncQueue.update({
          where: { id: item.id },
          data: { 
            status: 'FAILED',
            retryCount: { increment: 1 },
            lastError: error instanceof Error ? error.message : 'Unknown error'
          }
        })
        
        results.push({ id: item.id, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error processing sync:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const syncId = searchParams.get('syncId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (syncId) {
      // Delete specific sync item
      await db.syncQueue.delete({
        where: { id: syncId, userId: userId }
      })
    } else {
      // Clear all sync items for user
      await db.syncQueue.deleteMany({
        where: { userId: userId }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing sync items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}