import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Aurora from '@/components/ui/aurora'

export function UserInfoPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about creating amazing user experiences. Love working with React, TypeScript, and modern web technologies.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinDate: '2024-01-15',
    status: 'online',
    timezone: 'PST',
    languages: ['English', 'Chinese'],
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
  })

  const stats = {
    messagesSent: 1247,
    channelsJoined: 12,
    onlineHours: 156,
    streak: 7,
  }

  const recentActivity = [
    { id: 1, action: 'Joined channel', target: '#general', time: '2 hours ago', type: 'join' },
    {
      id: 2,
      action: 'Sent message',
      target: '#product-support',
      time: '4 hours ago',
      type: 'message',
    },
    { id: 3, action: 'Updated profile', target: '', time: '1 day ago', type: 'update' },
    {
      id: 4,
      action: 'Created channel',
      target: '#project-alpha',
      time: '3 days ago',
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
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
      variant: 'success',
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="relative min-h-svh bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>

      <div className="relative z-10 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Link to="/chat">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Chat
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Link to="/">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="mt-2 text-muted-foreground">Manage your account and view your activity</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-card/60 backdrop-blur border-white/10">
                <CardContent className="p-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-bold shadow-lg">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 size-6 rounded-full border-2 border-background ${getStatusColor(userInfo.status)}`}
                      ></div>
                    </div>

                    <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                    <p className="text-sm text-muted-foreground mb-2">{userInfo.email}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {userInfo.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {userInfo.timezone}
                      </Badge>
                    </div>

                    <Button
                      variant={isEditing ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="mb-4"
                    >
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Bio</label>
                      <p className="text-sm mt-1">{userInfo.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Location
                        </label>
                        <p className="text-sm mt-1">📍 {userInfo.location}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Website</label>
                        <a
                          href={userInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-1 block"
                        >
                          🌐 {userInfo.website}
                        </a>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Member Since
                        </label>
                        <p className="text-sm mt-1">
                          📅 {new Date(userInfo.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Skills</label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {userInfo.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
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
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/60 backdrop-blur border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stats.messagesSent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Messages Sent</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.channelsJoined}</div>
                    <div className="text-xs text-muted-foreground">Channels Joined</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.onlineHours}</div>
                    <div className="text-xs text-muted-foreground">Online Hours</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur border-white/10">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-card/60 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="text-lg">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {activity.action}
                            {activity.target && (
                              <span className="text-primary ml-1">{activity.target}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Edit Form Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Card className="w-full max-w-2xl mx-4 bg-card/90 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={userInfo.bio}
                        onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                        rows={3}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={userInfo.location}
                          onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="website" className="text-sm font-medium">
                          Website
                        </label>
                        <input
                          id="website"
                          type="url"
                          value={userInfo.website}
                          onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
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
