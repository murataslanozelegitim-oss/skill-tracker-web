import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      studentId,
      date,
      time,
      activityType,
      observedSkills,
      initiator,
      studentResponse,
      isGoalAligned,
      notes,
      tags
    } = body

    // Validate required fields
    if (!studentId || !activityType || !initiator || !studentResponse) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Get a default teacher (in real app, this would be the authenticated user)
    const teacher = await db.user.findFirst({
      where: { role: 'TEACHER' }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'No teacher found' },
        { status: 404 }
      )
    }

    // Get default behavior and environment
    const behavior = await db.behavior.findFirst()
    const environment = await db.environment.findFirst()

    if (!behavior || !environment) {
      return NextResponse.json(
        { error: 'Default behavior or environment not found' },
        { status: 404 }
      )
    }

    // Create the observation
    const observation = await db.observation.create({
      data: {
        studentId,
        teacherId: teacher.id,
        behaviorId: behavior.id,
        environmentId: environment.id,
        activity: activityType as any,
        initiatedBy: initiator.toUpperCase() as any,
        response: studentResponse,
        extraNotes: notes || '',
        note: notes || '',
        timestamp: new Date(`${date}T${time}`),
        duration: 0, // Default duration
        frequency: 1 // Default frequency
      }
    })

    return NextResponse.json({ 
      success: true, 
      observation: {
        id: observation.id,
        studentId: observation.studentId,
        timestamp: observation.timestamp,
        activity: observation.activity,
        initiatedBy: observation.initiatedBy,
        response: observation.response,
        extraNotes: observation.extraNotes,
        note: observation.note
      }
    })

  } catch (error) {
    console.error('Error creating observation:', error)
    return NextResponse.json(
      { error: 'Failed to create observation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = {}
    
    if (studentId) {
      whereClause.studentId = studentId
    }
    
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const observations = await db.observation.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            name: true
          }
        },
        behavior: {
          include: {
            category: true
          }
        },
        category: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    return NextResponse.json({ observations })

  } catch (error) {
    console.error('Error fetching observations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch observations' },
      { status: 500 }
    )
  }
}