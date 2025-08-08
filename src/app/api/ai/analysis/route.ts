import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, customPrompt } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Fetch student data
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        observations: {
          include: {
            behavior: {
              include: {
                category: true
              }
            },
            category: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 50 // Last 50 observations
        },
        goals: {
          include: {
            progress: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Analyze observation patterns
    const skillPatterns = analyzeSkillPatterns(student.observations)
    const behaviorInsights = analyzeBehaviorInsights(student.observations)
    const goalProgress = analyzeGoalProgress(student.goals)

    // Generate AI recommendations
    let aiRecommendations = []
    
    try {
      const zai = await ZAI.create()
      
      const prompt = createAnalysisPrompt(student, skillPatterns, behaviorInsights, goalProgress, customPrompt)
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Sen özel eğitim alanında uzman bir yapay zeka asistanısın. Otizm spektrumundaki preschool öğrencilerinin ön-sözel iletişim becerilerini geliştirmek için stratejiler öneriyorsun.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const aiResponse = completion.choices[0]?.message?.content
      if (aiResponse) {
        aiRecommendations = parseAIRecommendations(aiResponse)
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Fallback to rule-based recommendations
      aiRecommendations = generateFallbackRecommendations(skillPatterns, behaviorInsights, goalProgress)
    }

    const analysisData = {
      studentId,
      studentName: student.name,
      skillPatterns,
      behaviorInsights,
      goalProgress,
      recommendations: aiRecommendations,
      analysisDate: new Date(),
      customPrompt: customPrompt || null
    }

    return NextResponse.json({ 
      success: true, 
      analysis: analysisData 
    })

  } catch (error) {
    console.error('Error in AI analysis:', error)
    return NextResponse.json(
      { error: 'Failed to perform AI analysis' },
      { status: 500 }
    )
  }
}

function analyzeSkillPatterns(observations: any[]) {
  const skillCounts: Record<string, any> = {}
  
  observations.forEach(obs => {
    const skillName = obs.behavior?.category?.name || obs.category?.name || 'Diğer'
    if (!skillCounts[skillName]) {
      skillCounts[skillName] = {
        skill: skillName,
        frequency: 0,
        observations: [],
        lastObserved: null
      }
    }
    skillCounts[skillName].frequency++
    skillCounts[skillName].observations.push(obs)
    
    if (!skillCounts[skillName].lastObserved || obs.timestamp > skillCounts[skillName].lastObserved) {
      skillCounts[skillName].lastObserved = obs.timestamp
    }
  })

  return Object.values(skillCounts).map((skill: any) => {
    // Calculate trend based on recent observations
    const recentObservations = skill.observations
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
    
    const olderObservations = skill.observations
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(0, 10)
    
    let trend = 'stable'
    if (recentObservations.length > olderObservations.length) {
      trend = 'improving'
    } else if (recentObservations.length < olderObservations.length) {
      trend = 'declining'
    }

    return {
      skill: skill.skill,
      frequency: skill.frequency,
      trend,
      lastObserved: skill.lastObserved
    }
  })
}

function analyzeBehaviorInsights(observations: any[]) {
  if (observations.length === 0) {
    return {
      initiator: 'bilinmiyor',
      responseRate: 0,
      commonActivities: []
    }
  }

  const initiatorCounts: Record<string, number> = {}
  const activityCounts: Record<string, number> = {}
  let totalResponses = 0
  let positiveResponses = 0

  observations.forEach(obs => {
    // Count initiators
    const initiator = obs.initiatedBy || 'bilinmiyor'
    initiatorCounts[initiator] = (initiatorCounts[initiator] || 0) + 1

    // Count activities
    const activity = obs.activity || 'diğer'
    activityCounts[activity] = (activityCounts[activity] || 0) + 1

    // Count responses (assuming positive response if there's any response)
    totalResponses++
    if (obs.response && obs.response !== 'Tepki yok') {
      positiveResponses++
    }
  })

  // Find most common initiator
  const mostCommonInitiator = Object.entries(initiatorCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'bilinmiyor'

  // Find most common activities
  const commonActivities = Object.entries(activityCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([activity]) => activity)

  const responseRate = totalResponses > 0 ? Math.round((positiveResponses / totalResponses) * 100) : 0

  return {
    initiator: mostCommonInitiator,
    responseRate,
    commonActivities
  }
}

function analyzeGoalProgress(goals: any[]) {
  const activeGoals = goals.filter(g => g.status === 'ACTIVE')
  const completedGoals = goals.filter(g => g.status === 'COMPLETED')
  
  let totalProgress = 0
  let progressCount = 0

  goals.forEach(goal => {
    if (goal.progress && goal.progress.length > 0) {
      const latestProgress = goal.progress[0] // Assuming progress is ordered
      totalProgress += latestProgress.value || 0
      progressCount++
    }
  })

  const averageProgress = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0

  return {
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    averageProgress
  }
}

function createAnalysisPrompt(student: any, skillPatterns: any[], behaviorInsights: any, goalProgress: any, customPrompt?: string) {
  const basePrompt = `
Aşağıdaki öğrenci verilerini analiz ederek özel eğitim stratejileri öner:

Öğrenci Bilgileri:
- Ad: ${student.name}
- Yaş: ${student.age || 'bilinmiyor'}
- Sınıf: ${student.class?.name || 'bilinmiyor'}

Beceri Desenleri:
${skillPatterns.map(p => `- ${p.skill}: ${p.frequency} kez gözlemlendi, trend: ${p.trend}`).join('\n')}

Davranış İçgörüleri:
- En sık başlatan: ${behaviorInsights.initiator}
- Tepki oranı: %${behaviorInsights.responseRate}
- Yaygın etkinlikler: ${behaviorInsights.commonActivities.join(', ')}

Hedef İlerlemesi:
- Aktif hedefler: ${goalProgress.activeGoals}
- Tamamlanan hedefler: ${goalProgress.completedGoals}
- Ortalama ilerleme: %${goalProgress.averageProgress}

Lütfen bu analizlere dayanarak:
1. Öncelikli müdahale alanlarını belirle
2. Her alan için 2-3 spesifik strateji öner
3. Stratejilerin uygulama süresi ve zorluk seviyesini belirt
4. Başarı beklentilerini tanımla

Cevabını JSON formatında ver:
{
  "priorities": [
    {
      "area": "beceri alanı",
      "priority": "high|medium|low",
      "reasoning": "neden bu öncelikli"
    }
  ],
  "strategies": [
    {
      "title": "strateji adı",
      "description": "açıklama",
      "category": "beceri kategorisi",
      "difficulty": "easy|medium|hard",
      "timeRequired": 15,
      "steps": ["adım 1", "adım 2"],
      "materials": ["materyal 1", "materyal 2"],
      "expectedOutcome": "beklenen sonuç"
    }
  ]
}
`

  if (customPrompt) {
    return basePrompt + `\n\nÖzel Soru: ${customPrompt}`
  }

  return basePrompt
}

function parseAIRecommendations(aiResponse: string) {
  try {
    const parsed = JSON.parse(aiResponse)
    return parsed.strategies || []
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    return []
  }
}

function generateFallbackRecommendations(skillPatterns: any[], behaviorInsights: any, goalProgress: any) {
  const recommendations = []

  // Generate recommendations based on skill patterns
  skillPatterns.forEach(pattern => {
    if (pattern.trend === 'declining') {
      recommendations.push({
        area: pattern.skill,
        priority: 'high',
        reasoning: `${pattern.skill} becerisinde düşüş trendi gözlemlendi`
      })
    } else if (pattern.trend === 'stable' && pattern.frequency < 5) {
      recommendations.push({
        area: pattern.skill,
        priority: 'medium',
        reasoning: `${pattern.skill} becerisi gelişmeye açık`
      })
    }
  })

  // Add general recommendations based on response rate
  if (behaviorInsights.responseRate < 50) {
    recommendations.push({
      area: 'Genel İletişim',
      priority: 'high',
      reasoning: 'Düşük tepki oranı gözlemlendi'
    })
  }

  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}