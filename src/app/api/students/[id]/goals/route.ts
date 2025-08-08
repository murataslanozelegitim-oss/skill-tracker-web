import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id

    const goals = await db.goal.findMany({
      where: {
        studentId: studentId
      },
      include: {
        progress: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate progress percentage for each goal
    const goalsWithProgress = goals.map(goal => {
      const progress = goal.progress.length > 0 ? goal.progress[0] : null
      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate,
        status: goal.status,
        progress: progress ? progress.progressPercentage : 0,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt
      }
    })

    return NextResponse.json({ goals: goalsWithProgress })

  } catch (error) {
    console.error('Error fetching student goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id
    const body = await request.json()
    
    const { title, description, targetDate, status } = body

    // Validate required fields
    if (!title || !description || !targetDate) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Create the goal
    const goal = await db.goal.create({
      data: {
        studentId,
        title,
        description,
        targetDate: new Date(targetDate),
        status: status || 'not_started'
      }
    })

    // Create initial progress record
    await db.goalProgress.create({
      data: {
        goalId: goal.id,
        progressPercentage: 0,
        notes: 'Hedef oluşturuldu'
      }
    })

    return NextResponse.json({ 
      success: true, 
      goal: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate,
        status: goal.status,
        progress: 0
      }
    })

  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}