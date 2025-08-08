const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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
        description: 'Göz iletişimi becerileri'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Jest',
        description: 'Bedensel hareketlerle iletişim'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Ses çıkarma',
        description: 'Sesli iletişim becerileri'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'İşaret',
        description: 'İşaret dili becerileri'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Yüz ifadesi',
        description: 'Mimiklerle iletişim'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Vücut dili',
        description: 'Vücut pozisyonu ve hareketleri'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Sözel iletişim',
        description: 'Konuşma ve sözel ifade'
      }
    }),
    prisma.behaviorCategory.create({
      data: {
        name: 'Sosyal etkileşim',
        description: 'Sosyal beceriler ve etkileşim'
      }
    })
  ])

  // Create sample goals for students
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        studentId: students[0].id,
        title: 'Göz teması geliştirme',
        description: 'Öğretmenle konuşurken göz teması kurma',
        targetDate: new Date('2024-12-31'),
        status: 'in_progress'
      }
    }),
    prisma.goal.create({
      data: {
        studentId: students[0].id,
        title: 'Jest kullanımı',
        description: 'İsteklerini jestlerle ifade etme',
        targetDate: new Date('2024-12-31'),
        status: 'not_started'
      }
    }),
    prisma.goal.create({
      data: {
        studentId: students[1].id,
        title: 'Sesli tepkiler',
        description: 'Sesli uyaranlara tepki verme',
        targetDate: new Date('2024-12-31'),
        status: 'in_progress'
      }
    })
  ])

  // Create goal progress
  await Promise.all([
    prisma.goalProgress.create({
      data: {
        goalId: goals[0].id,
        progressPercentage: 60,
        notes: 'Göz teması belirgin şekilde gelişti'
      }
    }),
    prisma.goalProgress.create({
      data: {
        goalId: goals[1].id,
        progressPercentage: 20,
        notes: 'Jest kullanımı başlangıç aşamasında'
      }
    }),
    prisma.goalProgress.create({
      data: {
        goalId: goals[2].id,
        progressPercentage: 45,
        notes: 'Sesli tepkiler kısmen gelişti'
      }
    })
  ])

  // Create sample observations
  const observations = await Promise.all([
    prisma.observation.create({
      data: {
        studentId: students[0].id,
        teacherId: 'default-teacher-id', // We'll need to create a teacher first
        behaviorId: 'default-behavior-id', // We'll need to create a behavior first
        environmentId: 'default-environment-id', // We'll need to create an environment first
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
        teacherId: 'default-teacher-id',
        behaviorId: 'default-behavior-id',
        environmentId: 'default-environment-id',
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
        teacherId: 'default-teacher-id',
        behaviorId: 'default-behavior-id',
        environmentId: 'default-environment-id',
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

  // Create behavior records
  await Promise.all([
    prisma.behavior.create({
      data: {
        observationId: observations[0].id,
        categoryId: categories[0].id, // Göz teması
        frequency: 1,
        duration: 5,
        intensity: 3
      }
    }),
    prisma.behavior.create({
      data: {
        observationId: observations[1].id,
        categoryId: categories[1].id, // Jest
        frequency: 2,
        duration: 3,
        intensity: 2
      }
    }),
    prisma.behavior.create({
      data: {
        observationId: observations[2].id,
        categoryId: categories[2].id, // Ses çıkarma
        frequency: 3,
        duration: 10,
        intensity: 4
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