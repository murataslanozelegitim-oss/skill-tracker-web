"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"

interface WeeklyCalendarProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function WeeklyCalendar({ onDateSelect, selectedDate }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Pazartesi olarak ayarla
    return new Date(now.setDate(diff))
  })

  const getWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToToday = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    setCurrentWeekStart(new Date(now.setDate(diff)))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getDayName = (date: Date) => {
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
    return days[date.getDay()]
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const weekDates = getWeekDates(currentWeekStart)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Haftalık Takvim
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Bugün
            </Button>
            <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => (
            <Button
              key={index}
              variant={isSelected(date) ? "default" : "ghost"}
              className={`flex flex-col h-auto py-3 ${
                isToday(date) ? 'border-blue-500 border-2' : ''
              }`}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="text-xs font-medium text-muted-foreground">
                {getDayName(date)}
              </div>
              <div className="text-lg font-bold">
                {date.getDate()}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(date).split(' ')[1]}
              </div>
              {isToday(date) && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Bugün
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {weekDates[0].toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long' 
              })} - {weekDates[6].toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long' 
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}