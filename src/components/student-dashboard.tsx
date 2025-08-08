"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Calendar, 
  Target, 
  TrendingUp, 
  Eye, 
  Clock, 
  Award,
  BarChart3,
  Activity,
  BookOpen,
  Star,
  ChevronRight,
  Plus
} from "lucide-react"
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"
import { tr } from "date-fns/locale"

interface Student {
  id: string
  name: string
  surname: string
  class?: {
    name: string
  }
}

interface Goal {
  id: string
  title: string
  description: string
  targetDate: Date
  status: string
  progress: number
}

interface Observation {
  id: string
  timestamp: Date
  activity: string
  initiatedBy: string
  response: string
  extraNotes: string
  note: string
  behavior: {
    category: {
      name: string
    }
  }
  category?: {
    name: string
  }
}

interface StudentDashboardProps {
  student: Student
  onClose?: () => void
}

export function StudentDashboard({ student, onClose }: StudentDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("week")
  const [selectedTab, setSelectedTab] = useState("overview")

  useEffect(() => {
    fetchStudentData()
  }, [student.id, timeRange])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      
      // Fetch goals
      const goalsResponse = await fetch(`/api/students/${student.id}/goals`)
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json()
        setGoals(goalsData.goals || [])
      }

      // Fetch observations
      const endDate = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case "week":
          startDate = startOfWeek(endDate, { weekStartsOn: 1 })
          break
        case "month":
          startDate = subDays(endDate, 30)
          break
        case "quarter":
          startDate = subDays(endDate, 90)
          break
        default:
          startDate = startOfWeek(endDate, { weekStartsOn: 1 })
      }

      const obsResponse = await fetch(
        `/api/observations?studentId=${student.id}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      if (obsResponse.ok) {
        const obsData = await obsResponse.json()
        setObservations(obsData.observations || [])
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSkillStats = () => {
    const skillCounts: Record<string, number> = {}
    
    observations.forEach(obs => {
      const skillName = obs.behavior?.category?.name || obs.category?.name || 'Diğer'
      skillCounts[skillName] = (skillCounts[skillName] || 0) + 1
    })

    return Object.entries(skillCounts).map(([skill, count]) => ({
      skill,
      count,
      percentage: observations.length > 0 ? (count / observations.length) * 100 : 0
    }))
  }

  const getWeeklyProgress = () => {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
    const today = new Date()
    const weekData = days.map((day, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - today.getDay() + index + 1)
      
      const dayObservations = observations.filter(obs => 
        obs.timestamp.toDateString() === date.toDateString()
      )
      
      return {
        day,
        count: dayObservations.length,
        date
      }
    })
    
    return weekData
  }

  const getGoalProgress = () => {
    const activeGoals = goals.filter(goal => goal.status !== 'completed')
    const completedGoals = goals.filter(goal => goal.status === 'completed')
    
    return {
      active: activeGoals.length,
      completed: completedGoals.length,
      total: goals.length,
      percentage: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0
    }
  }

  const goalProgress = getGoalProgress()
  const skillStats = getSkillStats()
  const weeklyProgress = getWeeklyProgress()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'not_started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitiatorColor = (initiator: string) => {
    switch (initiator) {
      case 'öğrenci': return 'bg-purple-100 text-purple-800'
      case 'öğretmen': return 'bg-blue-100 text-blue-800'
      case 'akran': return 'bg-green-100 text-green-800'
      case 'nesne': return 'bg-orange-100 text-orange-800'
      case 'ortam': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {student.name} {student.surname}
            </h2>
            {student.class && (
              <p className="text-sm text-gray-600">{student.class.name}</p>
            )}
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{observations.length}</p>
                <p className="text-xs text-gray-600">Toplam Gözlem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{goalProgress.completed}</p>
                <p className="text-xs text-gray-600">Tamamlanan Hedef</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{skillStats.length}</p>
                <p className="text-xs text-gray-600">Beceri Türü</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {goalProgress.percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-600">Hedef Başarısı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="goals">Hedefler</TabsTrigger>
            <TabsTrigger value="observations">Gözlemler</TabsTrigger>
            <TabsTrigger value="progress">İlerleme</TabsTrigger>
          </TabsList>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Bu Hafta</SelectItem>
              <SelectItem value="month">Bu Ay</SelectItem>
              <SelectItem value="quarter">Bu Çeyrek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Skills Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Beceri Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillStats.map((stat) => (
                  <div key={stat.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{stat.skill}</span>
                      <span className="text-sm text-gray-600">{stat.count} kez</span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>
                ))}
                {skillStats.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Henüz beceri verisi bulunmuyor
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {observations.slice(0, 5).map((observation) => (
                  <div key={observation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{observation.activity}</p>
                        <p className="text-xs text-gray-600">
                          {format(observation.timestamp, 'd MMMM HH:mm', { locale: tr })}
                        </p>
                      </div>
                    </div>
                    <Badge className={getInitiatorColor(observation.initiatedBy.toLowerCase())}>
                      {observation.initiatedBy === 'TEACHER' ? 'Öğretmen' :
                       observation.initiatedBy === 'STUDENT' ? 'Öğrenci' :
                       observation.initiatedBy === 'PEER' ? 'Akran' : 'Diğer'}
                    </Badge>
                  </div>
                ))}
                {observations.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Henüz gözlem kaydı bulunmuyor
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hedefler</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Hedef
            </Button>
          </div>

          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status === 'completed' ? 'Tamamlandı' : 
                           goal.status === 'in_progress' ? 'Devam Ediyor' : 'Başlanmadı'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">İlerleme</span>
                          <span className="text-xs font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-500">Hedef Tarih</p>
                      <p className="text-sm font-medium">
                        {format(goal.targetDate, 'd MMMM yyyy', { locale: tr })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {goals.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz hedef belirlenmemiş</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="observations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gözlem Kayıtları</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Gözlem
            </Button>
          </div>

          <div className="space-y-4">
            {observations.map((observation) => (
              <Card key={observation.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{observation.activity}</h4>
                        <p className="text-sm text-gray-600">
                          {format(observation.timestamp, 'd MMMM yyyy HH:mm', { locale: tr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getInitiatorColor(observation.initiatedBy.toLowerCase())}>
                        {observation.initiatedBy === 'TEACHER' ? 'Öğretmen' :
                         observation.initiatedBy === 'STUDENT' ? 'Öğrenci' :
                         observation.initiatedBy === 'PEER' ? 'Akran' : 'Diğer'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Öğrencinin Tepkisi:</p>
                      <p className="text-sm text-gray-700">{observation.response}</p>
                    </div>
                    
                    {observation.behavior?.category && (
                      <div>
                        <p className="text-sm font-medium mb-1">Gözlemlenen Beceri:</p>
                        <Badge variant="outline" className="text-xs">
                          {observation.behavior.category.name}
                        </Badge>
                      </div>
                    )}
                    
                    {(observation.extraNotes || observation.note) && (
                      <div>
                        <p className="text-sm font-medium mb-1">Notlar:</p>
                        <p className="text-sm text-gray-700">{observation.extraNotes || observation.note}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {observations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz gözlem kaydı bulunmuyor</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Haftalık İlerleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-20">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <Progress 
                        value={day.count > 0 ? (day.count / Math.max(...weeklyProgress.map(d => d.count))) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{day.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Hedef İlerleme Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Aktif Hedefler</span>
                  <span className="text-sm font-bold">{goalProgress.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tamamlanan Hedefler</span>
                  <span className="text-sm font-bold">{goalProgress.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Toplam Hedefler</span>
                  <span className="text-sm font-bold">{goalProgress.total}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Genel Başarı</span>
                    <span className="text-sm font-bold">{goalProgress.percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={goalProgress.percentage} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}