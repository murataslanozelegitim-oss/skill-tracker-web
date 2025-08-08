"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Target, 
  Users, 
  Plus,
  Search,
  Filter,
  Star,
  CheckCircle,
  Clock
} from "lucide-react"
import { AIStrategies } from "./ai-strategies"

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
  successRate?: number
  isCustom: boolean
  teacher?: {
    name: string
  }
  createdAt: Date
}

export function InterventionStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<string>("")

  useEffect(() => {
    fetchStrategies()
  }, [])

  const fetchStrategies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/strategies')
      if (response.ok) {
        const data = await response.json()
        setStrategies(data.strategies.map((strategy: any) => ({
          id: strategy.id,
          title: strategy.title,
          description: strategy.description,
          category: strategy.category,
          difficulty: strategy.difficulty,
          timeRequired: strategy.timeRequired,
          materials: strategy.materials || [],
          steps: strategy.steps || [],
          expectedOutcome: strategy.expectedOutcome,
          successRate: strategy.successRate,
          isCustom: strategy.isCustom,
          teacher: strategy.teacher,
          createdAt: new Date(strategy.createdAt)
        })))
      }
    } catch (error) {
      console.error('Error fetching strategies:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...new Set(strategies.map(s => s.category))]
  const difficulties = ["all", "easy", "medium", "hard"]

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || strategy.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || strategy.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Kolay'
      case 'medium': return 'Orta'
      case 'hard': return 'Zor'
      default: return difficulty
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Müdahale Stratejileri
          </h2>
          <p className="text-gray-600">AI destekli kişiselleştirilmiş müdahale önerileri</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Strateji Ekle
        </Button>
      </div>

      <Tabs defaultValue="ai-recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Önerileri
          </TabsTrigger>
          <TabsTrigger value="strategies-library" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Strateji Kütüphanesi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-recommendations" className="space-y-6">
          {/* Student Selection for AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Öğrenci Seçimi
              </CardTitle>
              <CardDescription>
                AI analizleri için bir öğrenci seçin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ali Yılmaz</SelectItem>
                  <SelectItem value="2">Ayşe Kaya</SelectItem>
                  <SelectItem value="3">Mehmet Demir</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* AI Strategies Component */}
          {selectedStudent ? (
            <AIStrategies studentId={selectedStudent} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Analizi İçin Öğrenci Seçin</h3>
                <p className="text-gray-500">
                  Kişiye özel AI önerileri almak için lütfen bir öğrenci seçin.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategies-library" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Strateji ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Zorluk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="easy">Kolay</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="hard">Zor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strategy Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        {strategy.title}
                        {strategy.isCustom && (
                          <Badge variant="secondary" className="text-xs">
                            Özel
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {strategy.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getDifficultyColor(strategy.difficulty)}>
                        {getDifficultyText(strategy.difficulty)}
                      </Badge>
                      {strategy.successRate && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{strategy.successRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Strategy Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{strategy.timeRequired} dakika</span>
                      </div>
                      <Badge variant="outline">
                        {strategy.category}
                      </Badge>
                    </div>

                    {/* Materials */}
                    {strategy.materials && strategy.materials.length > 0 && (
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
                    )}

                    {/* Steps Preview */}
                    {strategy.steps && strategy.steps.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Adımlar:</h5>
                        <div className="text-sm text-gray-600">
                          {strategy.steps.slice(0, 2).map((step, index) => (
                            <div key={index} className="flex gap-2">
                              <span className="font-medium text-blue-600">{index + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))}
                          {strategy.steps.length > 2 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{strategy.steps.length - 2} adım daha
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expected Outcome */}
                    {strategy.expectedOutcome && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="font-medium mb-1">Beklenen Sonuç:</h5>
                        <p className="text-sm text-gray-700">{strategy.expectedOutcome}</p>
                      </div>
                    )}

                    {/* Teacher Info */}
                    {strategy.teacher && (
                      <div className="text-xs text-gray-500">
                        Oluşturan: {strategy.teacher.name}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Uygula
                      </Button>
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Detaylar
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
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strateji Bulunamadı</h3>
                <p className="text-gray-500 mb-4">
                  Arama kriterinize uygun strateji bulunamadı.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Strateji Ekle
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}