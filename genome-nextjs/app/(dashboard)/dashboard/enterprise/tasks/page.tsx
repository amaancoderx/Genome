'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Loader2,
  ListTodo,
  Target,
  Calendar,
  Trash2,
  CheckCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  strategyId: string
  phaseNumber: number
  phaseName: string
  activity: string
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: string
  prompt?: string
}

interface ExecutedStrategy {
  id: string
  prompt: string
  selectedStrategy: string
  executedAt: string
  tasks: Task[]
}

export default function TasksPage() {
  const router = useRouter()
  const [strategies, setStrategies] = useState<ExecutedStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)

  useEffect(() => {
    loadTasksFromStorage()
  }, [])

  const loadTasksFromStorage = () => {
    try {
      const stored = localStorage.getItem('genome_executed_strategies')
      if (stored) {
        const data = JSON.parse(stored)
        setStrategies(data)
        if (data.length > 0) {
          setSelectedStrategy(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = (strategyId: string, taskId: string, newStatus: Task['status']) => {
    setStrategies(prev => {
      const updated = prev.map(strategy => {
        if (strategy.id === strategyId) {
          return {
            ...strategy,
            tasks: strategy.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        }
        return strategy
      })
      localStorage.setItem('genome_executed_strategies', JSON.stringify(updated))
      return updated
    })
  }

  const deleteStrategy = (strategyId: string) => {
    setStrategies(prev => {
      const updated = prev.filter(s => s.id !== strategyId)
      localStorage.setItem('genome_executed_strategies', JSON.stringify(updated))
      if (selectedStrategy === strategyId && updated.length > 0) {
        setSelectedStrategy(updated[0].id)
      } else if (updated.length === 0) {
        setSelectedStrategy(null)
      }
      return updated
    })
  }

  const markAllComplete = (strategyId: string) => {
    setStrategies(prev => {
      const updated = prev.map(strategy => {
        if (strategy.id === strategyId) {
          return {
            ...strategy,
            tasks: strategy.tasks.map(task => ({ ...task, status: 'completed' as const }))
          }
        }
        return strategy
      })
      localStorage.setItem('genome_executed_strategies', JSON.stringify(updated))
      return updated
    })
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
      default:
        return <Circle className="h-5 w-5 text-slate-500" />
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30'
      case 'in_progress':
        return 'bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'bg-slate-800 border-slate-700'
    }
  }

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy)
  const totalTasks = strategies.reduce((acc, s) => acc + s.tasks.length, 0)
  const completedTasks = strategies.reduce(
    (acc, s) => acc + s.tasks.filter(t => t.status === 'completed').length, 0
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-genome-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/enterprise')}
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Enterprise
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
            <ListTodo className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Strategy Tasks</h1>
            <p className="text-slate-400">
              Track and manage tasks from executed strategies
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-genome-400" />
              <div>
                <p className="text-2xl font-bold text-white">{strategies.length}</p>
                <p className="text-xs text-slate-400">Executed Strategies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ListTodo className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
                <p className="text-xs text-slate-400">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedTasks}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{totalTasks - completedTasks}</p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {strategies.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <ListTodo className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
            <p className="text-slate-400 mb-6">
              Execute a strategy from the Enterprise Command Center to create tasks
            </p>
            <Button
              onClick={() => router.push('/dashboard/enterprise')}
              className="bg-gradient-to-r from-genome-500 to-purple-600"
            >
              Go to Enterprise
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Strategy List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Executed Strategies</h3>
            {strategies.map(strategy => {
              const completed = strategy.tasks.filter(t => t.status === 'completed').length
              const total = strategy.tasks.length
              const progress = total > 0 ? (completed / total) * 100 : 0

              return (
                <Card
                  key={strategy.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedStrategy === strategy.id
                      ? "bg-slate-800 border-genome-500"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  )}
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <CardContent className="p-4">
                    <p className="text-white text-sm font-medium mb-2 line-clamp-2">
                      {strategy.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="capitalize">{strategy.selectedStrategy}</span>
                      <span>{completed}/{total} tasks</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-genome-500 to-purple-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            {selectedStrategyData && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">
                        {selectedStrategyData.prompt.slice(0, 60)}...
                      </CardTitle>
                      <p className="text-xs text-slate-400 mt-1">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {new Date(selectedStrategyData.executedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAllComplete(selectedStrategyData.id)}
                        className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                      >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark All Done
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteStrategy(selectedStrategyData.id)}
                        className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStrategyData.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border transition-all",
                          getStatusColor(task.status)
                        )}
                      >
                        <button
                          onClick={() => {
                            const nextStatus: Task['status'] =
                              task.status === 'pending' ? 'in_progress' :
                              task.status === 'in_progress' ? 'completed' : 'pending'
                            updateTaskStatus(selectedStrategyData.id, task.id, nextStatus)
                          }}
                          className="flex-shrink-0"
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm",
                            task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'
                          )}>
                            {task.activity}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Phase {task.phaseNumber}: {task.phaseName}
                          </p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs capitalize",
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-700 text-slate-400'
                        )}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
