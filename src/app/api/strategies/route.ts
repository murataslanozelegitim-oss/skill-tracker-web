import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')

    const whereClause: any = {}
    
    if (category && category !== 'all') {
      whereClause.category = category
    }
    
    if (difficulty && difficulty !== 'all') {
      whereClause.difficulty = difficulty
    }

    const strategies = await db.interventionStrategy.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ strategies })

  } catch (error) {
    console.error('Error fetching strategies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch strategies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      difficulty,
      timeRequired,
      materials,
      steps,
      expectedOutcome,
      teacherId
    } = body

    // Validate required fields
    if (!title || !description || !category || !teacherId) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Create the strategy
    const strategy = await db.interventionStrategy.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 'medium',
        timeRequired: timeRequired || 15,
        materials: materials || [],
        steps: steps || [],
        expectedOutcome: expectedOutcome || '',
        teacherId,
        isCustom: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      strategy: {
        id: strategy.id,
        title: strategy.title,
        description: strategy.description,
        category: strategy.category,
        difficulty: strategy.difficulty,
        timeRequired: strategy.timeRequired,
        materials: strategy.materials,
        steps: strategy.steps,
        expectedOutcome: strategy.expectedOutcome,
        isCustom: strategy.isCustom,
        createdAt: strategy.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating strategy:', error)
    return NextResponse.json(
      { error: 'Failed to create strategy' },
      { status: 500 }
    )
  }
}