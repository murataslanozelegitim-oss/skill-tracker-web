"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  Target,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface StudentProgress {
  studentName: string
  behaviors: {
    name: string
    current: number
    previous: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }[]
}

interface GroupComparison {
  behavior: string
  studentCount: number
  averageValue: number
  classAverage: number
  status: 'above' | 'below' | 'average'
}

export function DataVisualization() {
  const [selectedStudent, setSelectedStudent] = useState("all")
  const [timeRange, setTimeRange] = useState("week")
  const [selectedBehavior, setSelectedBehavior] = useState("all")

  // Mock data
  const students = [
    { id: "1", name: "Ahmet Yılmaz" },
    { id: "2", name: "Ayşe Kaya" },
    { id: "3", name: "Mehmet Demir" }
  ]

  const behaviors = [
    { id: "1", name: "Göz Teması" },
    { id: "2", name: "İşaret Etme" },
    { id: "3", name: "Ses Çıkarma" }
  ]

  const studentProgress: StudentProgress[] = [
    {
      studentName: "Ahmet Yılmaz",
      behaviors: [
        { name: "Göz Teması", current: 75, previous: 60, change: 15, trend: 'up' },
        { name: "İşaret Etme", current: 45, previous: 40, change: 5, trend: 'up' },
        { name: "Ses Çıkarma", current: 30, previous: 35, change: -5, trend: 'down' }
      ]
    },
    {
      studentName: "Ayşe Kaya",
      behaviors: [
        { name: "Göz Teması", current: 85, previous: 80, change: 5, trend: 'up' },
        { name: "İşaret Etme", current: 60, previous: 55, change: 5, trend: 'up' },
        { name: "Ses Çıkarma", current: 50, previous: 45, change: 5, trend: 'up' }
      ]
    }
  ]

  const groupComparison: GroupComparison[] = [
    { behavior: "Göz Teması", studentCount: 3, averageValue: 72, classAverage: 65, status: 'above' },
    { behavior: "İşaret Etme", studentCount: 3, averageValue: 48, classAverage: 55, status: 'below' },
    { behavior: "Ses Çıkarma", studentCount: 3, averageValue: 38, classAverage: 40, status: 'average' }
  ]

  const weeklyData = [
    { day: "Pzt", observations: 12 },
    { day: "Sal", observations: 8 },
    { day: "Çar", observations: 15 },
    { day: "Per", observations: 10 },
    { day: "Cum", observations: 14 },
    { day: "Cmt", observations: 6 },
    { day: "Paz", observations: 4 }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: 'above' | 'below' | 'average') => {
    switch (status) {
      case 'above':
        return <Badge className="bg-green-100 text-green-800">Sınıf Ortalaması Üstü</Badge>
      case 'below':
        return <Badge className="bg-red-100 text-red-800">Sınıf Ortalaması Altı</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Sınıf Ortalaması</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Veri Analizi</h2>
          <p className="text-muted-foreground">Gözlem verilerini analiz edin ve yorumlayın</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Öğrenci</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öğrenciler</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zaman Aralığı</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Son Hafta</SelectItem>
                  <SelectItem value="month">Son Ay</SelectItem>
                  <SelectItem value="quarter">Son 3 Ay</SelectItem>
                  <SelectItem value="year">Son Yıl</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Davranış</label>
              <Select value={selectedBehavior} onValueChange={setSelectedBehavior}>
                <SelectTrigger>
                  <SelectValue placeholder="Davranış seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Davranışlar</SelectItem>
                  {behaviors.map((behavior) => (
                    <SelectItem key={behavior.id} value={behavior.id}>
                      {behavior.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Gelişim Grafiği</TabsTrigger>
          <TabsTrigger value="comparison">Grup Karşılaştırma</TabsTrigger>
          <TabsTrigger value="weekly">Haftalık Özet</TabsTrigger>
          <TabsTrigger value="insights">Otomatik Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {studentProgress.map((student) => (
              <Card key={student.studentName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {student.studentName}
                  </CardTitle>
                  <CardDescription>
                    Davranış gelişimleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.behaviors.map((behavior) => (
                    <div key={behavior.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{behavior.name}</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(behavior.trend)}
                          <span className={`text-sm ${
                            behavior.trend === 'up' ? 'text-green-600' : 
                            behavior.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {behavior.change > 0 ? '+' : ''}{behavior.change}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Önceki: {behavior.previous}%</span>
                          <span>Mevcut: {behavior.current}%</span>
                        </div>
                        <Progress value={behavior.current} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sınıf Geneli Karşılaştırma
              </CardTitle>
              <CardDescription>
                Öğrencilerinizin sınıf ortalamasına göre performansı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupComparison.map((item) => (
                  <div key={item.behavior} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.behavior}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{item.studentCount}</div>
                        <div className="text-xs text-muted-foreground">Öğrenci</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{item.averageValue}%</div>
                        <div className="text-xs text-muted-foreground">Sınıf Ort.</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{item.classAverage}%</div>
                        <div className="text-xs text-muted-foreground">Genel Ort.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Haftalık Gözlem Özeti
              </CardTitle>
              <CardDescription>
                Son haftanın gözlem dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 md:grid-cols-7">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="text-2xl font-bold text-primary mt-2">
                        {day.observations}
                      </div>
                      <div className="text-xs text-muted-foreground">gözlem</div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Toplam Gözlem</span>
                    <span className="text-2xl font-bold">
                      {weeklyData.reduce((sum, day) => sum + day.observations, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Günlük Ortalama</span>
                    <span className="text-lg font-semibold">
                      {Math.round(weeklyData.reduce((sum, day) => sum + day.observations, 0) / 7)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Olumlu Gelişim</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Ahmet'in göz teması son 3 haftada %40 arttı. Bu olumlu gelişimi sürdürmek için sosyal etkileşim aktivitelerine devam edin.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Dikkat Gereken</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      İşaret etme davranışı sınıf ortalamasının altında. Görsel destek materyalleri kullanarak bu alandaki gelişimi destekleyebilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Öneri</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Son 5 günde gözlem sayınızda düşüş var. Düzenli gözlem için günlük hatırlatıcıları ayarlamayı düşünebilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Hedef Takibi</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Ayşe'nin "sesli iletişim" hedefine %80 ulaşıldı. Yeni hedef belirlemek için uygun zaman.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}