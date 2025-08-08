"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, User, Calendar, Target, Eye, ChevronRight } from "lucide-react"
import { StudentDashboard } from "./student-dashboard"

interface Student {
  id: string
  name: string
  surname: string
  age?: number
  notes?: string
  class?: {
    name: string
  }
  lastObservation?: string
  observationCount: number
  goalsCount: number
}

export function StudentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({
    name: '',
    surname: '',
    age: '',
    notes: ''
  })
  
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students.map((student: any) => ({
          id: student.id,
          name: student.name,
          surname: student.surname,
          age: student.age,
          notes: student.notes,
          class: student.class,
          lastObservation: student.lastObservation,
          observationCount: student.observationCount || 0,
          goalsCount: student.goalsCount || 0
        })))
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStudent = async () => {
    try {
      const response = await fetch('/api/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStudent.name,
          surname: newStudent.surname,
          age: parseInt(newStudent.age) || null,
          notes: newStudent.notes
        }),
      })

      if (response.ok) {
        setNewStudent({ name: '', surname: '', age: '', notes: '' })
        setIsAddDialogOpen(false)
        fetchStudents()
      }
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const filteredStudents = students.filter(student =>
    `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedStudent) {
    return (
      <StudentDashboard 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />
    )
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
          <h2 className="text-2xl font-bold">Öğrenciler</h2>
          <p className="text-muted-foreground">Öğrenci listenizi yönetin</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Öğrenci Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Öğrenci Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir öğrenci eklemek için bilgileri doldurun.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Öğrenci Adı</Label>
                <Input 
                  id="name" 
                  placeholder="Öğrenci adı" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surname">Öğrenci Soyadı</Label>
                <Input 
                  id="surname" 
                  placeholder="Öğrenci soyadı" 
                  value={newStudent.surname}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, surname: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Yaş</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Yaş" 
                  value={newStudent.age}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Öğrenci hakkında notlar" 
                  value={newStudent.notes}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCreateStudent}>
                Kaydet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Öğrenci ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {student.name} {student.surname}
                </CardTitle>
                {student.age && (
                  <Badge variant="secondary">{student.age} yaş</Badge>
                )}
              </div>
              {student.class && (
                <CardDescription className="text-sm">
                  {student.class.name}
                </CardDescription>
              )}
              {student.notes && (
                <CardDescription className="line-clamp-2">
                  {student.notes}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Son Gözlem</span>
                </div>
                <span className="text-muted-foreground">
                  {student.lastObservation || "Yok"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {student.observationCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Gözlem</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {student.goalsCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Hedef</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => setSelectedStudent(student)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Hedefler
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Öğrenci Bulunamadı</h3>
            <p className="text-muted-foreground text-center mb-4">
              Arama kriterinize uygun öğrenci bulunamadı.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Öğrenciyi Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}