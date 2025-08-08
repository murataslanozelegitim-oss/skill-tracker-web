"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Star
} from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Strategy {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeRequired: number
  materials: string[]
  steps: string[]
  expectedOutcome: string
  successRate: number
  relatedSkills: string[]
  aiConfidence: number
  createdAt: Date
}

interface AnalysisData {
  studentId: string
  skillPatterns: {
    skill: string
    frequency: number
    trend: 'improving' | 'stable' | 'declining'
    lastObserved: Date
  }[]
  behaviorInsights: {
    initiator: string
    responseRate: number
    commonActivities: string[]
  }
  goalProgress: {
    activeGoals: number
    completedGoals: number
    averageProgress: number
  }
  recommendations: {
    priority: 'high' | 'medium' | 'low'
    category: string
    description: string
  }[]
}

interface AIStrategiesProps {
  studentId?: string
}

export function AIStrategies({ studentId }: AIStrategiesProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  useEffect(() => {
    if (studentId) {
      fetchAnalysisData()
      fetchStrategies()
    }
  }, [studentId])

  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would call an AI analysis endpoint
      // For now, we'll use mock data
      const mockAnalysis: AnalysisData = {
        studentId: studentId || "",
        skillPatterns: [
          {
            skill: "Göz teması",
            frequency: 12,
            trend: "improving",
            lastObserved: new Date()
          },
          {
            skill: "Jest",
            frequency: 8,
            trend: "stable",
            lastObserved: new Date()
          },
          {
            skill: "Ses çıkarma",
            frequency: 5,
            trend: "declining",
            lastObserved: new Date()
          }
        ],
        behaviorInsights: {
          initiator: "öğretmen",
          responseRate: 75,
          commonActivities: ["Oyun zamanı", "Grup etkinliği"]
        },
        goalProgress: {
          activeGoals: 2,
          completedGoals: 1,
          averageProgress: 65
        },
        recommendations: [
          {
            priority: "high",
            category: "Göz teması",
            description: "Göz teması becerisi gelişiyor, bu ilerlemeyi destekleyen stratejiler öner"
          },
          {
            priority: "medium",
            category: "Jest kullanımı",
            description: "Jest kullanımı istikrarlı, çeşitlilik artırılabilir"
          },
          {
            priority: "high",
            category: "Sesli iletişim",
            description: "Sesli tepkiler azalıyor, acil müdahale gerekiyor"
          }
        ]
      }
      setAnalysisData(mockAnalysis)
    } catch (error) {
      console.error('Error fetching analysis data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStrategies = async () => {
    try {
      // Mock strategies data
      const mockStrategies: Strategy[] = [
        {
          id: "1",
          title: "Yüz yüze göz teması oyunları",
          description: "Öğrencinin yüz yüze iletişimde göz teması kurma becerisini geliştirmek için tasarlanmış oyunlar",
          category: "Göz teması",
          difficulty: "easy",
          timeRequired: 15,
          materials: ["Oyuncak bebek", "Ayna", "Resimli kartlar"],
          steps: [
            "Öğrenciyle aynı seviyeye oturun",
            "Oyun sırasında sürekli göz teması kurmaya çalışın",
            "Göz teması kurduğunda övgü ve teşekkür edin",
            "Ayna kullanarak yüz ifadelerini keşfedin"
          ],
          expectedOutcome: "Öğrenci isteyerek göz teması kurmaya başlayacak",
          successRate: 85,
          relatedSkills: ["Göz teması", "Sosyal etkileşim"],
          aiConfidence: 92,
          createdAt: new Date()
        },
        {
          id: "2",
          title: "İstek jestlerini geliştirme",
          description: "Öğrencinin temel ihtiyaçlarını jestlerle ifade etmesini sağlayan egzersizler",
          category: "Jest",
          difficulty: "medium",
          timeRequired: 20,
          materials: ["Resimli kartlar", "Ödül stickerları", "Tercih edilen nesneler"],
          steps: [
            "Öğrencinin sevdiği nesneleri hazırlayın",
            "Nesneyi gösterin ve jesti modelleyin",
            "Öğrencinin jestini bekleyin",
            "Doğru jest yapıldığında hemen verin"
          ],
          expectedOutcome: "Öğrenci 3-5 temel jesti kullanabilecek",
          successRate: 78,
          relatedSkills: ["Jest", "İletişim", "Sosyal beceriler"],
          aiConfidence: 88,
          createdAt: new Date()
        },
        {
          id: "3",
          title: "Sesli taklit oyunları",
          description: "Öğrencinin sesli tepkilerini artırmak için eğlenceli taklit oyunları",
          category: "Ses çıkarma",
          difficulty: "easy",
          timeRequired: 10,
          materials: ["Müzik aletleri", "Hayvan figürleri", "Sesli oyuncaklar"],
          steps: [
            "Basit sesler yapın (örn: hayvan sesleri)",
            "Öğrencinin taklit etmesini bekleyin",
            "Taklit ettiğinde büyük tepki verin",
            "Oyunu kısa tutun ve tekrarlayın"
          ],
          expectedOutcome: "Öğrenci sesli uyaranlara tepki vermeye başlayacak",
          successRate: 72,
          relatedSkills: ["Ses çıkarma", "Dikkat", "Taklit"],
          aiConfidence: 85,
          createdAt: new Date()
        }
      ]
      setStrategies(mockStrategies)
    } catch (error) {
      console.error('Error fetching strategies:', error)
    }
  }

  const generateAIRecommendations = async () => {
    if (!studentId) return

    try {
      setGenerating(true)
      
      // In a real implementation, this would call the ZAI SDK
      // For now, we'll simulate the AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add new AI-generated strategies
      const newStrategy: Strategy = {
        id: Date.now().toString(),
        title: "Kişiye özel müdahale planı",
        description: "AI tarafından analiz edilen gözlem verilerine dayalı olarak oluşturulmuş kişiselleştirilmiş strateji",
        category: "Kişiye Özel",
        difficulty: "medium",
        timeRequired: 25,
        materials: ["Öğrencinin ilgi alanları", "Gözlem kayıtları", "Ödül sistemi"],
        steps: [
          "Öğrencinin güçlü yönlerini belirleyin",
          "Zayıf alanlar için hedefler koyun",
          "Küçük adımlarla ilerleyin",
          "Her başarıyı kutlayın"
        ],
        expectedOutcome: "Bireysel ihtiyaçlara uygun hızda ilerleme",
        successRate: 90,
        relatedSkills: ["Kişiye özel", "Bütüncül yaklaşım"],
        aiConfidence: 95,
        createdAt: new Date()
      }
      
      setStrategies(prev => [newStrategy, ...prev])
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'stable': return <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
      case 'declining': return <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
    }
  }

  const filteredStrategies = selectedCategory === "all" 
    ? strategies 
    : strategies.filter(s => s.category === selectedCategory)

  const categories = ["all", ...new Set(strategies.map(s => s.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            AI Destekli Stratejiler
          </h2>
          <p className="text-gray-600">Yapay zeka destekli kişiselleştirilmiş müdahale önerileri</p>
        </div>
        <Button 
          onClick={generateAIRecommendations} 
          disabled={generating}
          className="bg-gradient-to-r from-blue-500 to-purple-600"
        >
          {generating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          AI Analizi Yap
        </Button>
      </div>

      {/* AI Analysis Summary */}
      {analysisData && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-5 h-5" />
              AI Analiz Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Skill Patterns */}
              <div>
                <h4 className="font-medium mb-2 text-blue-900">Beceri Desenleri</h4>
                <div className="space-y-2">
                  {analysisData.skillPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">{pattern.skill}</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(pattern.trend)}
                        <span className="text-xs text-blue-600">{pattern.frequency} kez</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavior Insights */}
              <div>
                <h4 className="font-medium mb-2 text-blue-900">Davranış İçgörüleri</h4>
                <div className="space-y-1">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Tepki Oranı:</span> {analysisData.behaviorInsights.responseRate}%
                  </p>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Sık Başlatan:</span> {analysisData.behaviorInsights.initiator}
                  </p>
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Yaygın Etkinlikler:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysisData.behaviorInsights.commonActivities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Progress */}
              <div>
                <h4 className="font-medium mb-2 text-blue-900">Hedef İlerlemesi</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Aktif Hedefler</span>
                    <span className="font-medium">{analysisData.goalProgress.activeGoals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Tamamlanan</span>
                    <span className="font-medium">{analysisData.goalProgress.completedGoals}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-700">Ortalama İlerleme</span>
                      <span className="font-medium">{analysisData.goalProgress.averageProgress}%</span>
                    </div>
                    <Progress value={analysisData.goalProgress.averageProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-medium mb-2 text-blue-900">AI Önerileri</h4>
              <div className="grid gap-2 md:grid-cols-3">
                {analysisData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-blue-800">{rec.category}</p>
                      <p className="text-xs text-blue-700">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom AI Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Kişiye Özel AI Sorgusu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Öğrenci hakkında özel bir durum veya soru yazın, AI size kişiselleştirilmiş stratejiler önerecek..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={generateAIRecommendations}
              disabled={!customPrompt.trim() || generating}
              variant="outline"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              AI'dan Öneri Al
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Tüm Kategoriler" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Strategies Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    {strategy.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {strategy.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getDifficultyColor(strategy.difficulty)}>
                    {strategy.difficulty === 'easy' ? 'Kolay' : 
                     strategy.difficulty === 'medium' ? 'Orta' : 'Zor'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{strategy.aiConfidence}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Strategy Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{strategy.timeRequired} dakika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>%{strategy.successRate} başarı</span>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h5 className="font-medium mb-2">Gereken Materyaller:</h5>
                  <div className="flex flex-wrap gap-1">
                    {strategy.materials.map((material, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h5 className="font-medium mb-2">Adımlar:</h5>
                  <ol className="text-sm space-y-1">
                    {strategy.steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium text-blue-600">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Related Skills */}
                <div>
                  <h5 className="font-medium mb-2">İlgili Beceriler:</h5>
                  <div className="flex flex-wrap gap-1">
                    {strategy.relatedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium mb-1">Beklenen Sonuç:</h5>
                  <p className="text-sm text-gray-700">{strategy.expectedOutcome}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Uygula
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Strateji Bulunamadı</h3>
            <p className="text-gray-500 mb-4">
              Seçilen kategoriye uygun strateji bulunamadı.
            </p>
            <Button onClick={() => setSelectedCategory("all")}>
              Tüm Stratejileri Göster
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}