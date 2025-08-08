"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, 
  Trophy, 
  Star, 
  Target,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Zap,
  Crown,
  Medal,
  Gift
} from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  points: number
  isEarned: boolean
  earnedAt?: string
  progress: number
  requirement: string
}

interface Streak {
  current: number
  longest: number
  lastObservationDate: string
}

export function Achievements() {
  const [activeTab, setActiveTab] = useState("achievements")

  // Mock data
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "İlk Gözlem",
      description: "İlk gözleminizi tamamlayın",
      icon: "👁️",
      category: "Başlangıç",
      points: 10,
      isEarned: true,
      earnedAt: "2024-01-10",
      progress: 100,
      requirement: "1 gözlem yap"
    },
    {
      id: "2",
      title: "Gözlem Ustası",
      description: "50 gözlem tamamlayın",
      icon: "📊",
      category: "Gözlem",
      points: 50,
      isEarned: true,
      earnedAt: "2024-01-12",
      progress: 100,
      requirement: "50 gözlem yap"
    },
    {
      id: "3",
      title: "Haftalık Kahraman",
      description: "7 gün üst üste gözlem yapın",
      icon: "🗓️",
      category: "Süreklilik",
      points: 30,
      isEarned: false,
      progress: 71,
      requirement: "7 gün üst üste gözlem yap"
    },
    {
      id: "4",
      title: "Öğrenci Dostu",
      description: "5 farklı öğrenci için gözlem yapın",
      icon: "👥",
      category: "Çeşitlilik",
      points: 25,
      isEarned: true,
      earnedAt: "2024-01-11",
      progress: 100,
      requirement: "5 farklı öğrenci"
    },
    {
      id: "5",
      title: "Veri Analisti",
      description: "10 farklı grafik analizi yapın",
      icon: "📈",
      category: "Analiz",
      points: 40,
      isEarned: false,
      progress: 60,
      requirement: "10 grafik analizi"
    },
    {
      id: "6",
      title: "Strateji Uzmanı",
      description: "10 farklı müdahale stratejisi uygulayın",
      icon: "💡",
      category: "Uygulama",
      points: 45,
      isEarned: false,
      progress: 30,
      requirement: "10 strateji uygula"
    },
    {
      id: "7",
      title: "Sesli Not Kralı",
      description: "20 sesli not ekleyin",
      icon: "🎤",
      category: "İnovasyon",
      points: 35,
      isEarned: false,
      progress: 45,
      requirement: "20 sesli not"
    },
    {
      id: "8",
      title: "Zaman Yönetimi",
      description: "10 zamanlanmış gözlem yapın",
      icon: "⏰",
      category: "Verimlilik",
      points: 30,
      isEarned: true,
      earnedAt: "2024-01-13",
      progress: 100,
      requirement: "10 zamanlanmış gözlem"
    }
  ]

  const streak: Streak = {
    current: 5,
    longest: 12,
    lastObservationDate: "2024-01-15"
  }

  const stats = {
    totalPoints: 190,
    totalAchievements: 8,
    earnedAchievements: 4,
    currentLevel: 5,
    nextLevelPoints: 250,
    weeklyGoalProgress: 71,
    monthlyGoalProgress: 85
  }

  const categories = ["Tümü", "Başlangıç", "Gözlem", "Süreklilik", "Çeşitlilik", "Analiz", "Uygulama", "İnovasyon", "Verimlilik"]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Başlangıç":
        return <Star className="w-4 h-4" />
      case "Gözlem":
        return <Target className="w-4 h-4" />
      case "Süreklilik":
        return <Calendar className="w-4 h-4" />
      case "Çeşitlilik":
        return <Users className="w-4 h-4" />
      case "Analiz":
        return <TrendingUp className="w-4 h-4" />
      case "Uygulama":
        return <BookOpen className="w-4 h-4" />
      case "İnovasyon":
        return <Zap className="w-4 h-4" />
      case "Verimlilik":
        return <Clock className="w-4 h-4" />
      default:
        return <Award className="w-4 h-4" />
    }
  }

  const earnedAchievements = achievements.filter(a => a.isEarned)
  const inProgressAchievements = achievements.filter(a => !a.isEarned && a.progress > 0)
  const lockedAchievements = achievements.filter(a => !a.isEarned && a.progress === 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Başarılar & Ödüller</h2>
          <p className="text-muted-foreground">İlerlemenizi takip edin ve başarılar kazanın</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Trophy className="w-4 h-4 mr-1" />
            Seviye {stats.currentLevel}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Toplam Puan</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.earnedAchievements}</div>
            <div className="text-sm text-muted-foreground">Kazanılan Başarı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{streak.current}</div>
            <div className="text-sm text-muted-foreground">Günlük Seri</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{streak.longest}</div>
            <div className="text-sm text-muted-foreground">En Uzun Seri</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Seviye Atlama İlerlemesi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Seviye {stats.currentLevel}</span>
              <span>{stats.totalPoints} / {stats.nextLevelPoints} puan</span>
            </div>
            <Progress value={(stats.totalPoints / stats.nextLevelPoints) * 100} className="h-3" />
          </div>
          <div className="text-center">
            <Badge variant="outline">
              {stats.nextLevelPoints - stats.totalPoints} puan kaldı
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Zap className="w-5 h-5" />
            Gözlem Serisi
          </CardTitle>
          <CardDescription className="text-orange-700">
            Sürekli gözlem yaparak serinizi büyütün
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{streak.current}</div>
              <div className="text-sm text-muted-foreground">Mevcut Seri</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{streak.longest}</div>
              <div className="text-sm text-muted-foreground">En Uzun Seri</div>
            </div>
          </div>
          {streak.current >= 5 && (
            <div className="mt-4 p-3 bg-orange-100 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <Medal className="w-5 h-5" />
                <span className="font-medium">Harika! {streak.current} günlük seriniz var!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Başarılar</TabsTrigger>
          <TabsTrigger value="goals">Hedefler</TabsTrigger>
          <TabsTrigger value="rewards">Ödüller</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {getCategoryIcon(category)}
                <span className="ml-1">{category}</span>
              </Button>
            ))}
          </div>

          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Kazanılan Başarılar
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {earnedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge className="bg-green-100 text-green-800">
                              +{achievement.points} puan
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {achievement.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {achievement.earnedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Achievements */}
          {inProgressAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Devam Eden Başarılar
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {inProgressAchievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl opacity-50">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant="outline">
                              +{achievement.points} puan
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          <div className="space-y-2 mt-3">
                            <div className="flex justify-between text-xs">
                              <span>{achievement.requirement}</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-600" />
                Kilitli Başarılar
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {lockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant="outline">
                              +{achievement.points} puan
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {achievement.requirement}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Haftalık Hedef
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>14 gözlem</span>
                    <span>{stats.weeklyGoalProgress}%</span>
                  </div>
                  <Progress value={stats.weeklyGoalProgress} className="h-3" />
                </div>
                <div className="text-center">
                  <Badge variant="outline">
                    10 gözlem kaldı
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Aylık Hedef
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>50 gözlem</span>
                    <span>{stats.monthlyGoalProgress}%</span>
                  </div>
                  <Progress value={stats.monthlyGoalProgress} className="h-3" />
                </div>
                <div className="text-center">
                  <Badge variant="outline">
                    8 gözlem kaldı
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Gift className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-medium">Seviye 5 Ödülü</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Özel tema ve rozet
                </p>
                <Badge className="mt-2">Kilitli</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Gift className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-medium">Haftalık Seri Ödülü</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  7 gün seri için bonus puan
                </p>
                <Badge className="mt-2 bg-green-100 text-green-800">Mevcut</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Gift className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-medium">Yılın Öğretmeni</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  1000 puan hedefi
                </p>
                <Badge variant="outline">810 puan kaldı</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}