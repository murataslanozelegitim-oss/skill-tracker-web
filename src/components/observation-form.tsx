"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Mic, Save, X, Clock, Calendar, User, Activity, Target, MessageSquare, Tag } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Student {
  id: string
  name: string
  surname: string
}

interface ObservationFormProps {
  students: Student[]
  onClose: () => void
  onSave: (data: any) => void
}

export function ObservationForm({ students, onClose, onSave }: ObservationFormProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    activityType: "",
    observedSkills: [] as string[],
    initiator: "",
    studentResponse: "",
    isGoalAligned: false,
    notes: "",
    tags: [] as string[],
    audioNote: null as File | null
  })

  const [newTag, setNewTag] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{ queued: boolean; message: string }>({ queued: false, message: '' })

  const activityTypes = [
    "Oyun zamanı",
    "Grup etkinliği",
    "Serbest zaman",
    "Yemek zamanı",
    "Hikaye okuma",
    "Müzik etkinliği",
    "Sanat etkinliği",
    "Dışarıda oyun",
    "Bireysel çalışma",
    "Diğer"
  ]

  const skills = [
    "Göz teması",
    "Jest",
    "Ses çıkarma",
    "İşaret",
    "Yüz ifadesi",
    "Vücut dili",
    "Sözel iletişim",
    "Sosyal etkileşim"
  ]

  const initiators = [
    "Öğrenci",
    "Öğretmen",
    "Akran",
    "Nesne",
    "Ortam"
  ]

  const responseOptions = [
    "Tepki verdi - Jestle",
    "Tepki verdi - Göz temasıyla",
    "Tepki verdi - Sesle",
    "Tepki verdi - Kombine",
    "Tepki yok",
    "Tepki belirsiz"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Try to save directly first
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        onSave(result.observation)
        setSyncStatus({ queued: false, message: 'Gözlem başarıyla kaydedildi' })
      } else {
        // If network error, queue for sync
        if (!navigator.onLine) {
          const { syncService } = await import('@/lib/sync-service')
          await syncService.queueForSync('/api/observations', 'POST', formData)
          setSyncStatus({ queued: true, message: 'Gözlem çevrimdışı kaydedildi, çevrimiçi olunca senkronize edilecek' })
          onSave({ ...formData, id: Date.now().toString(), _pendingSync: true })
        } else {
          console.error('Failed to save observation')
          setSyncStatus({ queued: false, message: 'Gözlem kaydedilemedi' })
        }
      }
    } catch (error) {
      console.error('Error saving observation:', error)
      
      // Queue for sync if it's a network error
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        const { syncService } = await import('@/lib/sync-service')
        await syncService.queueForSync('/api/observations', 'POST', formData)
        setSyncStatus({ queued: true, message: 'Gözlem çevrimdışı kaydedildi, çevrimiçi olunca senkronize edilecek' })
        onSave({ ...formData, id: Date.now().toString(), _pendingSync: true })
      } else {
        setSyncStatus({ queued: false, message: 'Gözlem kaydedilemedi' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      observedSkills: prev.observedSkills.includes(skill)
        ? prev.observedSkills.filter(s => s !== skill)
        : [...prev.observedSkills, skill]
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop audio recording
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold">Yeni Gözlem Ekle</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Öğrenci Adı */}
            <div className="space-y-2">
              <Label htmlFor="student" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Öğrenci Adı
              </Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} {student.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tarih ve Saat */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tarih
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Saat
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Etkinlik Türü */}
            <div className="space-y-2">
              <Label htmlFor="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Etkinlik Türü
              </Label>
              <Select
                value={formData.activityType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Etkinlik türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gözlemlenen Beceriler */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Gözlemlenen Beceriler
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.observedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* İletişimi Başlatan */}
            <div className="space-y-2">
              <Label htmlFor="initiator">İletişimi Başlatan</Label>
              <Select
                value={formData.initiator}
                onValueChange={(value) => setFormData(prev => ({ ...prev, initiator: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Başlatan seçin" />
                </SelectTrigger>
                <SelectContent>
                  {initiators.map((initiator) => (
                    <SelectItem key={initiator} value={initiator}>
                      {initiator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Öğrencinin Tepkisi */}
            <div className="space-y-2">
              <Label htmlFor="response" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Öğrencinin Tepkisi
              </Label>
              <Select
                value={formData.studentResponse}
                onValueChange={(value) => setFormData(prev => ({ ...prev, studentResponse: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tepki seçin" />
                </SelectTrigger>
                <SelectContent>
                  {responseOptions.map((response) => (
                    <SelectItem key={response} value={response}>
                      {response}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Beceri Hedefle Uyumlu mu? */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="goalAligned"
                checked={formData.isGoalAligned}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isGoalAligned: checked as boolean }))}
              />
              <Label htmlFor="goalAligned">Beceri hedefle uyumlu mu?</Label>
            </div>

            {/* Ek Notlar / Gözlem Detayı */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ek Notlar / Gözlem Detayı</Label>
              <div className="relative">
                <Textarea
                  id="notes"
                  placeholder="Gözlemleriniz ve notlarınızı buraya yazın..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={toggleRecording}
                >
                  <Mic className="w-4 h-4" />
                  {isRecording ? "Durdur" : "Ses Kaydı"}
                </Button>
              </div>
            </div>

            {/* Etiketler */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Etiketler (Opsiyonel)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Etiket ekle..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Ekle
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sync Status Message */}
            {syncStatus.message && (
              <div className={`p-3 rounded-md text-sm ${
                syncStatus.queued 
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {syncStatus.queued ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    {syncStatus.message}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {syncStatus.message}
                  </div>
                )}
              </div>
            )}

            {/* Butonlar */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}