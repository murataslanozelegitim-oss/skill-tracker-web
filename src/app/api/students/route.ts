import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const whereClause: any = {}
    
    if (classId) {
      whereClause.classId = classId
    }

    const students = await db.student.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        goals: {
          include: {
            progress: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ students })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}