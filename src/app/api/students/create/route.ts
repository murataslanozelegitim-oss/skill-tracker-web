import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, surname, age, notes, classId } = body

    // Validate required fields
    if (!name || !surname) {
      return NextResponse.json(
        { error: 'Name and surname are required' },
        { status: 400 }
      )
    }

    // Create the student
    const student = await db.student.create({
      data: {
        name,
        surname,
        age: age || null,
        notes: notes || '',
        classId: classId || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      student: {
        id: student.id,
        name: student.name,
        surname: student.surname,
        age: student.age,
        notes: student.notes,
        classId: student.classId
      }
    })

  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}