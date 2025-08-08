const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding intervention strategies...')

  // Get a teacher for the strategies
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  })

  if (!teacher) {
    console.error('No teacher found. Please run the main seed script first.')
    return
  }

  const strategies = [
    {
      title: 'Yüz yüze göz teması oyunları',
      description: 'Öğrencinin yüz yüze iletişimde göz teması kurma becerisini geliştirmek için tasarlanmış oyunlar',
      category: 'Göz teması'
    },
    {
      title: 'İstek jestlerini geliştirme',
      description: 'Öğrencinin temel ihtiyaçlarını jestlerle ifade etmesini sağlayan egzersizler',
      category: 'Jest'
    },
    {
      title: 'Sesli taklit oyunları',
      description: 'Öğrencinin sesli tepkilerini artırmak için eğlenceli taklit oyunları',
      category: 'Ses çıkarma'
    },
    {
      title: 'Sosyal hikaye anlatımı',
      description: 'Sosyal becerileri geliştirmek için hikaye anlatımı tekniği',
      category: 'Sosyal etkileşim'
    },
    {
      title: 'Duygu tanıma kartları',
      description: 'Farklı duygu ifadelerini tanıma ve ifade etme becerisi',
      category: 'Duygusal gelişim'
    }
  ]

  for (const strategy of strategies) {
    await prisma.interventionStrategy.create({
      data: {
        ...strategy,
        teacherId: teacher.id,
        isCustom: false
      }
    })
  }

  console.log('✅ Intervention strategies seeded successfully!')
  console.log(`Created ${strategies.length} strategies`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding strategies:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })