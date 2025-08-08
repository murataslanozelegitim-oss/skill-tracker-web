"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  Target,
  AlertCircle,
  MapPin,
  Timer
} from "lucide-react"

interface ObservationTask {
  id: string
  title: string
  studentName: string
  activity: string
  scheduledTime: string
  duration: number
  status: 'pending' | 'in_progress' | 'completed' | 'missed'
  priority: 'low' | 'medium' | 'high'
}

interface ObservationTasksProps {
  selectedDate?: Date
  onTaskComplete?: (taskId: string) => void
  onTaskStart?: (taskId: string) => void
}

export function ObservationTasks({ selectedDate, onTaskComplete, onTaskStart }: ObservationTasksProps) {
  const [tasks, setTasks] = useState<ObservationTask[]>([
    {
      id: "1",
      title: "Ali'yi park saatinde gözle",
      studentName: "Ali Yılmaz",
      activity: "Park Saati",
      scheduledTime: "10:00",
      duration: 15,
      status: "pending",
      priority: "high"
    },
    {
      id: "2",
      title: "Ayşe ile yemek zamanında gözlem yap",
      studentName: "Ayşe Kaya",
      activity: "Yemek Saati",
      scheduledTime: "12:00",
      duration: 10,
      status: "in_progress",
      priority: "medium"
    },
    {
      id: "3",
      title: "Mehmet'in serbest oyununu gözle",
      studentName: "Mehmet Demir",
      activity: "Serbest Oyun",
      scheduledTime: "14:30",
      duration: 20,
      status: "pending",
      priority: "medium"
    },
    {
      id: "4",
      title: "Zeynep ile grup dersinde gözlem",
      studentName: "Zeynep Çelik",
      activity: "Grup Dersi",
      scheduledTime: "09:00",
      duration: 15,
      status: "completed",
      priority: "high"
    },
    {
      id: "5",
      title: "Can'ın bireysel dersini gözle",
      studentName: "Can Öztürk",
      activity: "Bireysel Ders",
      scheduledTime: "11:00",
      duration: 10,
      status: "missed",
      priority: "low"
    }
  ])

  const handleTaskStatusChange = (taskId: string, newStatus: ObservationTask['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    
    if (newStatus === 'completed') {
      onTaskComplete?.(taskId)
    } else if (newStatus === 'in_progress') {
      onTaskStart?.(taskId)
    }
  }

  const getStatusIcon = (status: ObservationTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: ObservationTask['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'missed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: ObservationTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
    }
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Filter tasks for selected date (mock filtering)
  const filteredTasks = tasks // In real app, this would filter by selectedDate

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Gözlem Görevleri
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {completedTasks}/{totalTasks} Tamamlandı
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Günlük İlerleme</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg transition-all ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                task.status === 'missed' ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-1">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleTaskStatusChange(task.id, 'completed')
                      } else {
                        handleTaskStatusChange(task.id, 'pending')
                      }
                    }}
                  />
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? 'Yüksek' : 
                         task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'completed' ? 'Tamamlandı' :
                         task.status === 'in_progress' ? 'Devam Ediyor' :
                         task.status === 'missed' ? 'Kaçırıldı' : 'Bekliyor'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{task.studentName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{task.activity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>{task.duration} dk</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {task.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                  >
                    Başla
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTaskStatusChange(task.id, 'completed')}
                  >
                    Tamamla
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Bu tarih için planlanmış görev bulunmuyor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}