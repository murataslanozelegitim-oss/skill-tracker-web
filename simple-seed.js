const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample teacher
  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      name: 'Öğretmen',
      role: 'TEACHER'
    }
  })

  // Create a sample class
  const class1 = await prisma.class.create({
    data: {
      name: '4 Yaş Grubu',
      description: '4 yaş öğrenciler için sınıf',
      schoolYear: '2024-2025'
    }
  })

  // Create sample students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: 'Ali Yılmaz',
        age: 4,
        notes: 'Sosyal etkileşimde güçlük gösteriyor',
        classId: class1.id
      }
    }),
    prisma.student.create({
      data: {
        name: 'Ayşe Kaya',
        age: 5,
        notes: 'Göz teması gelişiyor',
        classId: class1.id
      }
    }),
    prisma.student.create({
      data: {
        name: 'Mehmet Demir',
        age: 4,
        notes: 'İşaret dili kullanmayı öğreniyor',
        classId: class1.id
      }
    })
  ])

  // Create behavior categories
  const categories = await Promise.all([
    prisma.behaviorCategory.create({
      data: {
        name: 'Göz teması',
        description: 'Göz iletişimi becerileri',
        teacherId: teacher.id
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Jest',
        description: 'Bedensel hareketlerle iletişim',
        teacherId: teacher.id
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Ses çıkarma',
        description: 'Sesli iletişim becerileri',
        teacherId: teacher.id
      }
    })
  ])

  // Create behaviors
  const behaviors = await Promise.all([
    prisma.behavior.create({
      data: {
        name: 'Göz teması kurma',
        description: 'İletişimde göz teması kurma',
        categoryId: categories[0].id,
        teacherId: teacher.id
      }
    }),
    prisma.behavior.create({
      data: {
        name: 'Jest kullanma',
        description: 'İletişimde jest kullanma',
        categoryId: categories[1].id,
        teacherId: teacher.id
      }
    }),
    prisma.behavior.create({
      data: {
        name: 'Sesli tepki',
        description: 'Sesli tepki verme',
        categoryId: categories[2].id,
        teacherId: teacher.id
      }
    })
  ])

  // Create environments
  const environments = await Promise.all([
    prisma.environment.create({
      data: {
        name: 'Sınıf içi',
        description: 'Sınıf ortamı',
        teacherId: teacher.id
      }
    }),
    prisma.environment.create({
      data: {
        name: 'Oyun alanı',
        description: 'Oyun alanı ortamı',
        teacherId: teacher.id
      }
    })
  ])

  // Create sample goals for students
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        studentId: students[0].id,
        teacherId: teacher.id,
        title: 'Göz teması geliştirme',
        description: 'Öğretmenle konuşurken göz teması kurma',
        startDate: new Date(),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    }),
    prisma.goal.create({
      data: {
        studentId: students[0].id,
        teacherId: teacher.id,
        title: 'Jest kullanımı',
        description: 'İsteklerini jestlerle ifade etme',
        startDate: new Date(),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    }),
    prisma.goal.create({
      data: {
        studentId: students[1].id,
        teacherId: teacher.id,
        title: 'Sesli tepkiler',
        description: 'Sesli uyaranlara tepki verme',
        startDate: new Date(),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    })
  ])

  // Create goal progress
  await Promise.all([
    prisma.goalProgress.create({
      data: {
        goalId: goals[0].id,
        value: 60,
        notes: 'Göz teması belirgin şekilde gelişti',
        teacherId: teacher.id
      }
    }),
    prisma.goalProgress.create({
      data: {
        goalId: goals[1].id,
        value: 20,
        notes: 'Jest kullanımı başlangıç aşamasında',
        teacherId: teacher.id
      }
    }),
    prisma.goalProgress.create({
      data: {
        goalId: goals[2].id,
        value: 45,
        notes: 'Sesli tepkiler kısmen gelişti',
        teacherId: teacher.id
      }
    })
  ])

  // Create sample observations
  const observations = await Promise.all([
    prisma.observation.create({
      data: {
        studentId: students[0].id,
        teacherId: teacher.id,
        behaviorId: behaviors[0].id,
        environmentId: environments[0].id,
        categoryId: categories[0].id,
        activity: 'FREE_PLAY',
        initiatedBy: 'TEACHER',
        response: 'Tepki verdi - Göz temasıyla',
        extraNotes: 'Oyun sırasında göz teması kurdu',
        note: 'Oyun sırasında göz teması kurdu',
        duration: 300,
        frequency: 1,
        timestamp: new Date('2024-01-15T10:30:00')
      }
    }),
    prisma.observation.create({
      data: {
        studentId: students[1].id,
        teacherId: teacher.id,
        behaviorId: behaviors[1].id,
        environmentId: environments[1].id,
        categoryId: categories[1].id,
        activity: 'GROUP_LESSON',
        initiatedBy: 'PEER',
        response: 'Tepki verdi - Jestle',
        extraNotes: 'Akranıyla etkileşimde jest kullandı',
        note: 'Akranıyla etkileşimde jest kullandı',
        duration: 180,
        frequency: 2,
        timestamp: new Date('2024-01-14T14:15:00')
      }
    }),
    prisma.observation.create({
      data: {
        studentId: students[2].id,
        teacherId: teacher.id,
        behaviorId: behaviors[2].id,
        environmentId: environments[0].id,
        categoryId: categories[2].id,
        activity: 'CIRCLE_TIME',
        initiatedBy: 'TEACHER',
        response: 'Tepki verdi - Sesle',
        extraNotes: 'Hikaye sırasında sesli tepkiler verdi',
        note: 'Hikaye sırasında sesli tepkiler verdi',
        duration: 600,
        frequency: 3,
        timestamp: new Date('2024-01-13T09:45:00')
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${students.length} students, ${goals.length} goals, ${observations.length} observations`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })