"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Download,
  Upload,
  Trash2,
  Plus,
  Save,
  Eye,
  Volume2,
  Moon,
  Sun
} from "lucide-react"

interface ModuleSetting {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface BehaviorCategory {
  id: string
  name: string
  description: string
  icon: string
  isCustom: boolean
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    language: "tr",
    theme: "light",
    notifications: true,
    reminderTime: "09:00",
    dataRetention: 365,
    autoBackup: true,
    voiceInput: true,
    soundEffects: true,
    hapticFeedback: true
  })

  const [moduleSettings, setModuleSettings] = useState<ModuleSetting[]>([
    { id: "observation", name: "Gözlem Modülü", description: "Öğrenci gözlemleri", enabled: true },
    { id: "analytics", name: "Veri Analizi", description: "Grafikler ve istatistikler", enabled: true },
    { id: "strategies", name: "Müdahale Stratejileri", description: "Pedagojik öneriler", enabled: true },
    { id: "achievements", name: "Başarılar", description: "Oyunlaştırma ve ödüller", enabled: true },
    { id: "voice", name: "Sesli Giriş", description: "Ses tanıma özellikleri", enabled: true },
    { id: "backup", name: "Yedekleme", description: "Otomatik veri yedekleme", enabled: true }
  ])

  const [customCategories, setCustomCategories] = useState<BehaviorCategory[]>([
    { id: "1", name: "Sosyal Beceriler", description: "Sosyal etkileşim becerileri", icon: "👥", isCustom: true },
    { id: "2", name: "Duygu Tanıma", description: "Duyguları tanıma ve ifade etme", icon: "😊", isCustom: true }
  ])

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📝"
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setModuleSettings(prev => 
      prev.map(module => 
        module.id === moduleId ? { ...module, enabled } : module
      )
    )
  }

  const addCustomCategory = () => {
    if (newCategory.name.trim()) {
      const category: BehaviorCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
        isCustom: true
      }
      setCustomCategories(prev => [...prev, category])
      setNewCategory({ name: "", description: "", icon: "📝" })
    }
  }

  const removeCustomCategory = (id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ayarlar</h2>
        <p className="text-muted-foreground">Uygulamayı kişiselleştirin ve yönetin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="modules">Modüller</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="data">Veri</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Dil ve Bölge
                </CardTitle>
                <CardDescription>
                  Uygulama dilini ve bölge ayarlarını yapılandırın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dil</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Saat Formatı</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 Saat</SelectItem>
                      <SelectItem value="12">12 Saat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Görünüm
                </CardTitle>
                <CardDescription>
                  Uygulama görünümünü kişiselleştirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Açık Tema
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Koyu Tema
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="w-4 h-4" />
                          Sistem Teması
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Yazı Boyutu</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Küçük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="large">Büyük</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildirimler
                </CardTitle>
                <CardDescription>
                  Bildirim tercihlerini ayarlayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bildirimler</Label>
                    <p className="text-sm text-muted-foreground">
                      Bildirimleri aç/kapat
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                {settings.notifications && (
                  <div className="space-y-2">
                    <Label>Hatırlatma Saati</Label>
                    <Input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sesli Bildirimler</Label>
                    <p className="text-sm text-muted-foreground">
                      Bildirim sesleri
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Ses ve Dokunma
                </CardTitle>
                <CardDescription>
                  Sesli giriş ve geri bildirim ayarları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sesli Giriş</Label>
                    <p className="text-sm text-muted-foreground">
                      Sesle veri girişi aktif
                    </p>
                  </div>
                  <Switch
                    checked={settings.voiceInput}
                    onCheckedChange={(checked) => handleSettingChange('voiceInput', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dokunsal Geri Bildirim</Label>
                    <p className="text-sm text-muted-foreground">
                      Titreşimler
                    </p>
                  </div>
                  <Switch
                    checked={settings.hapticFeedback}
                    onCheckedChange={(checked) => handleSettingChange('hapticFeedback', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modül Yönetimi</CardTitle>
              <CardDescription>
                Hangi modüllerin aktif olacağını seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {moduleSettings.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-muted-foreground">{module.description}</div>
                  </div>
                  <Switch
                    checked={module.enabled}
                    onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Özel Davranış Kategorileri</CardTitle>
              <CardDescription>
                Kendi davranış kategorilerinizi oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Yeni Kategori Ekle</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Kategori adı"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                    <Input
                      placeholder="Açıklama"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, icon: "📝"})}
                      >
                        📝
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, icon: "👁️"})}
                      >
                        👁️
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, icon: "🎯"})}
                      >
                        🎯
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, icon: "💬"})}
                      >
                        💬
                      </Button>
                    </div>
                    <Button onClick={addCustomCategory} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Ekle
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Mevcut Kategoriler</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Veri Yönetimi
                </CardTitle>
                <CardDescription>
                  Veri saklama ve yedekleme ayarları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Veri Saklama Süresi (gün)</Label>
                  <Input
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Otomatik Yedekleme</Label>
                    <p className="text-sm text-muted-foreground">
                      Günlük otomatik yedekleme
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Verileri Dışa Aktar
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Verileri İçe Aktar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Gizlilik ve Güvenlik
                </CardTitle>
                <CardDescription>
                  Veri güvenliği ve gizlilik ayarları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Veri Şifreleme</div>
                      <div className="text-sm text-muted-foreground">
                        Tüm veriler şifrelenir
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sesli Kayıt</div>
                      <div className="text-sm text-muted-foreground">
                        Ses kayıtları saklanmaz
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Güvenli</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Anonimleştirme</div>
                      <div className="text-sm text-muted-foreground">
                        Öğrenci verileri anonimleştirilir
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Tüm Verileri Sil
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Bu işlem geri alınamaz
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hesap Yönetimi</CardTitle>
              <CardDescription>
                Hesap bilgilerinizi yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>İsim</Label>
                  <Input defaultValue="Öğretmen" />
                </div>
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input defaultValue="ogretmen@okul.com" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Değişiklikleri Kaydet
                </Button>
                <Button variant="outline">Şifre Değiştir</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">İptal</Button>
        <Button>Kaydet</Button>
      </div>
    </div>
  )
}