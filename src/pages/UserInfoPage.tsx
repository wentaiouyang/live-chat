import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Aurora from '@/components/ui/aurora'
import { ArrowLeft, Home, Edit, X, Save, MapPin, Globe, Calendar, Mail } from 'lucide-react'

export function UserInfoPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: '全栈开发者，热衷于创造极致的用户体验。喜爱 React, TypeScript 和现代 Web 技术。',
    location: '上海, 中国',
    website: 'https://johndoe.dev',
    joinDate: '2024-01-15',
    status: '在线',
    timezone: 'UTC+8',
    languages: ['中文', 'English'],
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
  })

  const stats = {
    messagesSent: 1247,
    channelsJoined: 12,
    onlineHours: 156,
    streak: 7,
  }

  const recentActivity = [
    { id: 1, action: '加入频道', target: '#general', time: '2 小时前', type: 'join' },
    {
      id: 2,
      action: '发送消息',
      target: '#product-support',
      time: '4 小时前',
      type: 'message',
    },
    { id: 3, action: '更新资料', target: '', time: '1 天前', type: 'update' },
    {
      id: 4,
      action: '创建频道',
      target: '#project-alpha',
      time: '3 天前',
      type: 'create',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'join':
        return '👋'
      case 'message':
        return '💬'
      case 'update':
        return '✏️'
      case 'create':
        return '➕'
      default:
        return '📝'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在线':
        return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
      case '离开':
        return 'bg-yellow-500'
      case '忙碌':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: '资料已更新',
      description: '您的个人资料已成功保存。',
      variant: 'success',
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="relative min-h-svh bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>

      <div className="relative z-10 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 gap-2 pl-2"
              >
                <Link to="/chat">
                  <ArrowLeft className="h-4 w-4" />
                  返回聊天
                </Link>
              </Button>
              <div className="h-4 w-px bg-border/50"></div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 gap-2"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  首页
                </Link>
              </Button>
            </div>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              个人资料
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">管理您的账户并查看活动概览</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-4">
              <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden h-full">
                <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                <CardContent className="p-6 relative">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center text-center -mt-16 mb-6">
                    <div className="relative mb-4 group">
                      <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-white text-3xl font-bold shadow-xl border-4 border-background ring-2 ring-border/20 transition-transform group-hover:scale-105">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute bottom-1 right-1 size-7 rounded-full border-4 border-background ${getStatusColor(userInfo.status)} transition-all`}
                        title={userInfo.status}
                      ></div>
                    </div>

                    <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" /> {userInfo.email}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                      >
                        {userInfo.status}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        {userInfo.timezone}
                      </Badge>
                    </div>

                    <Button
                      variant={isEditing ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="mt-6 w-full gap-2 transition-all"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4" /> 取消编辑
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" /> 编辑资料
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-6 pt-4 border-t border-border/50">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        简介
                      </label>
                      <p className="text-sm leading-relaxed">{userInfo.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            位置
                          </label>
                          <p className="text-sm mt-0.5">{userInfo.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            网站
                          </label>
                          <a
                            href={userInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-0.5 block truncate max-w-[200px]"
                          >
                            {userInfo.website}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            加入时间
                          </label>
                          <p className="text-sm mt-0.5">
                            {new Date(userInfo.joinDate).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        技能
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="hover:bg-secondary/80 transition-colors cursor-default"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Activity */}
            <div className="lg:col-span-8 space-y-8">
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stats.messagesSent.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      发送消息
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stats.channelsJoined}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      加入频道
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stats.onlineHours}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      在线时长
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stats.streak}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      连续登录 (天)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-xl">近期活动</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">
                            {activity.action}
                            {activity.target && (
                              <span className="text-primary ml-1.5">{activity.target}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Edit Form Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between">
                  <CardTitle>编辑资料</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-6" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          姓名
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          邮箱
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        简介
                      </label>
                      <textarea
                        id="bio"
                        value={userInfo.bio}
                        onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                          位置
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={userInfo.location}
                          onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="website" className="text-sm font-medium">
                          网站
                        </label>
                        <input
                          id="website"
                          type="url"
                          value={userInfo.website}
                          onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border/50">
                      <Button type="submit" className="flex-1 gap-2">
                        <Save className="h-4 w-4" /> 保存更改
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        取消
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
