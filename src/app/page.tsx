"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentList } from "@/components/student-list"
import { ObservationForm } from "@/components/observation-form"
import { DataVisualization } from "@/components/data-visualization"
import { InterventionStrategies } from "@/components/intervention-strategies"
import { Achievements } from "@/components/achievements"
import { Settings } from "@/components/settings"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { ObservationTasks } from "@/components/observation-tasks"
import { SyncStatus } from "@/components/sync-status"
import { 
  Users, 
  Eye, 
  BarChart3, 
  Lightbulb, 
  Award, 
  Settings as SettingsIcon,
  Plus,
  Mic,
  Calendar,
  Target,
  BookOpen,
  Bell,
  CheckCircle,
  Clock
} from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("observation")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showObservationForm, setShowObservationForm] = useState(false)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students')
        if (response.ok) {
          const data = await response.json()
          setStudents(data.students)
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleSaveObservation = (data: any) => {
    console.log("Saving observation:", data)
    // In a real implementation, this would save to the database
    setShowObservationForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gözlem Asistanı</h1>
                <p className="text-xs text-gray-500">Özel Eğitim Gözlem Sistemi</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aktif
              </Badge>
              <SyncStatus />
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="observation" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Gözlem</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Öğrenciler</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analiz</span>
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Stratejiler</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Başarılar</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Ayarlar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="observation" className="space-y-6">
            {/* Haftalık Takvim */}
            <WeeklyCalendar 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            {/* Gözlem Görevleri */}
            <ObservationTasks 
              selectedDate={selectedDate}
              onTaskComplete={(taskId) => {
                console.log("Task completed:", taskId)
              }}
              onTaskStart={(taskId) => {
                console.log("Task started:", taskId)
              }}
            />

            {/* Hızlı Ekleme Butonu */}
            <div className="fixed bottom-6 right-6 z-40 md:static md:bottom-auto md:right-auto">
              <Button
                size="lg"
                className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>

            {/* Hızlı Ekleme Paneli */}
            {showQuickAdd && (
              <Card className="border-2 border-blue-200 bg-blue-50 animate-in slide-in-from-bottom-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Plus className="w-5 h-5" />
                    Hızlı Gözlem Ekle
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Gözlem eklemek için bir yöntem seçin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button
                      className="h-20 flex-col gap-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
                      variant="outline"
                      onClick={() => {
                        setShowQuickAdd(false)
                        setShowObservationForm(true)
                      }}
                    >
                      <Target className="w-6 h-6" />
                      <span className="font-medium">Formla Ekle</span>
                      <span className="text-xs text-muted-foreground">3 temel beceri</span>
                    </Button>
                    <Button
                      className="h-20 flex-col gap-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
                      variant="outline"
                      onClick={() => {
                        setShowQuickAdd(false)
                        // Ses kaydı modalını aç
                      }}
                    >
                      <Mic className="w-6 h-6" />
                      <span className="font-medium">Sesle Ekle</span>
                      <span className="text-xs text-muted-foreground">Konuşarak yaz</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowQuickAdd(false)}
                  >
                    İptal
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 3 Temel Beceri Bilgilendirme */}
            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-2">3 Temel Söz Öncesi Beceri</h4>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-purple-700"><strong>Göz Teması:</strong> Görsel iletişim</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-purple-700"><strong>Jestler:</strong> Bedensel iletişim</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-purple-700"><strong>Seslendirme:</strong> Sözel iletişim</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <DataVisualization />
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <InterventionStrategies />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Achievements />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Observation Form Modal */}
      {showObservationForm && (
        <ObservationForm
          students={students}
          onClose={() => setShowObservationForm(false)}
          onSave={handleSaveObservation}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-6 gap-1 p-2">
          {[
            { value: "observation", icon: Eye },
            { value: "students", icon: Users },
            { value: "analytics", icon: BarChart3 },
            { value: "strategies", icon: Lightbulb },
            { value: "achievements", icon: Award },
            { value: "settings", icon: SettingsIcon }
          ].map(({ value, icon: Icon }) => (
            <Button
              key={value}
              variant={activeTab === value ? "default" : "ghost"}
              size="sm"
              className="flex-col h-12"
              onClick={() => setActiveTab(value)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}