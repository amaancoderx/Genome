'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  Dna,
  ArrowRight,
  FileText,
  Zap,
  Loader2,
  Building2,
  Brain,
  Users,
  DollarSign,
  Settings,
  HeadphonesIcon,
  UserCog,
  Target,
  Network,
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  Radar,
} from 'lucide-react'

interface UserStats {
  chatsThisMonth: number
  reportsGenerated: number
  strategiesExecuted: number
  tasksCompleted: number
}

const agentIcons = [
  { icon: TrendingUp, color: 'from-green-500 to-emerald-600', name: 'Sales' },
  { icon: Target, color: 'from-pink-500 to-rose-600', name: 'Marketing' },
  { icon: DollarSign, color: 'from-yellow-500 to-amber-600', name: 'Finance' },
  { icon: Settings, color: 'from-blue-500 to-indigo-600', name: 'Operations' },
  { icon: HeadphonesIcon, color: 'from-purple-500 to-violet-600', name: 'Support' },
  { icon: UserCog, color: 'from-orange-500 to-red-600', name: 'HR' },
]

export default function DashboardPage() {
  const { user } = useUser()
  const [stats, setStats] = useState<UserStats>({
    chatsThisMonth: 0,
    reportsGenerated: 0,
    strategiesExecuted: 0,
    tasksCompleted: 0,
  })
  const [loading, setLoading] = useState(true)
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 })

  useEffect(() => {
    const loadAllStats = async () => {
      // First get localStorage stats (these are always available)
      let localStrategiesCount = 0
      let localTasksCompleted = 0
      let localTasksPending = 0

      try {
        const stored = localStorage.getItem('genome_executed_strategies')
        if (stored) {
          const strategies = JSON.parse(stored)
          localStrategiesCount = strategies.length
          const allTasks = strategies.flatMap((s: any) => s.tasks || [])
          localTasksCompleted = allTasks.filter((t: any) => t.status === 'completed').length
          localTasksPending = allTasks.length - localTasksCompleted
          setTaskStats({
            total: allTasks.length,
            completed: localTasksCompleted,
            pending: localTasksPending,
          })
        }
      } catch (error) {
        console.error('Error loading task stats:', error)
      }

      // Then fetch API stats and merge with local stats
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({
            chatsThisMonth: data.chatsThisMonth || 0,
            reportsGenerated: data.reportsGenerated || 0,
            strategiesExecuted: localStrategiesCount,
            tasksCompleted: localTasksCompleted,
          })
        } else {
          // If API fails, still set local stats
          setStats(prev => ({
            ...prev,
            strategiesExecuted: localStrategiesCount,
            tasksCompleted: localTasksCompleted,
          }))
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // If API fails, still set local stats
        setStats(prev => ({
          ...prev,
          strategiesExecuted: localStrategiesCount,
          tasksCompleted: localTasksCompleted,
        }))
      } finally {
        setLoading(false)
      }
    }

    loadAllStats()
  }, [])

  const quickActions = [
    {
      title: 'Enterprise Command',
      description: 'Execute strategic decisions with 6 AI agents',
      icon: Building2,
      href: '/dashboard/enterprise',
      color: 'from-genome-500 to-purple-600',
      badge: 'CORE',
    },
    {
      title: 'Strategy Tasks',
      description: 'Track and manage tasks from executed strategies',
      icon: ListTodo,
      href: '/dashboard/enterprise/tasks',
      color: 'from-orange-500 to-amber-500',
      stats: taskStats.pending > 0 ? `${taskStats.pending} pending` : null,
    },
    {
      title: 'AI Chat Assistant',
      description: 'Get instant marketing advice and content ideas',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Ad Intelligence',
      description: 'Competitive ad analysis with creative concepts and insights',
      icon: Radar,
      href: '/dashboard/ad-intelligence',
      color: 'from-sky-500 to-indigo-500',
      badge: 'NEW',
    },
    {
      title: 'Brand Genome',
      description: 'Analyze your brand DNA and get strategic insights',
      icon: Dna,
      href: '/dashboard/genome',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const statsDisplay = [
    { label: 'Strategies Executed', value: stats.strategiesExecuted, icon: Building2, color: 'text-genome-400' },
    { label: 'Tasks Completed', value: stats.tasksCompleted, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Chats This Month', value: stats.chatsThisMonth, icon: MessageSquare, color: 'text-cyan-400' },
    { label: 'Reports Generated', value: stats.reportsGenerated, icon: FileText, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.firstName || 'there'}!
        </h1>
        <p className="text-slate-400">
          Your AI-powered enterprise command center awaits.
        </p>
      </div>

      {/* Enterprise Command Center Banner */}
      <Link href="/dashboard/enterprise">
        <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-genome-500/30 hover:border-genome-500/50 transition-all duration-300 mb-8 cursor-pointer group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-genome-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">Enterprise Command Center</h2>
                    <span className="px-2 py-0.5 bg-genome-500/20 rounded-full text-xs font-medium text-genome-400">CORE</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Issue strategic prompts and coordinate 6 AI agents across your organization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Mini Agent Icons */}
                <div className="hidden md:flex items-center -space-x-2">
                  {agentIcons.map((agent, i) => (
                    <div
                      key={agent.name}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center border-2 border-slate-900`}
                    >
                      <agent.icon className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <Button variant="premium" className="group-hover:scale-105 transition-transform">
                  <Brain className="mr-2 h-4 w-4" />
                  Launch
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsDisplay.map((stat) => (
          <Card
            key={stat.label}
            className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-genome-400 animate-spin" />
                  ) : (
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-0.5 bg-genome-500/20 rounded-full text-xs font-medium text-genome-400">
                        {action.badge}
                      </span>
                    )}
                    {action.stats && (
                      <span className="px-2 py-0.5 bg-orange-500/20 rounded-full text-xs font-medium text-orange-400">
                        {action.stats}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-genome-400 text-sm font-medium group-hover:text-genome-300">
                    Open
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enterprise Agents */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-genome-400" />
              Enterprise AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">
              6 specialized agents ready to execute your strategic commands
            </p>
            <div className="grid grid-cols-2 gap-3">
              {agentIcons.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">{agent.name} Agent</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/enterprise">
              <Button variant="outline" className="w-full mt-4 bg-slate-800 text-white border-genome-500/50 hover:bg-slate-700 hover:text-white">
                <Building2 className="mr-2 h-4 w-4" />
                Open Command Center
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Ready to transform your enterprise? Here's how to get started:
            </p>
            <ol className="space-y-3">
              {[
                { text: 'Set up your Company Profile with AI guidance', icon: Users },
                { text: 'Launch Enterprise Command for strategic decisions', icon: Building2 },
                { text: 'Track tasks from executed strategies', icon: ListTodo },
                { text: 'Chat with AI for instant insights', icon: MessageSquare },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-genome-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300 text-sm">{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
