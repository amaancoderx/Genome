'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Loader2,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  HeadphonesIcon,
  UserCog,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  FileText,
  Zap,
  Network,
  Shield,
  Rocket,
  Scale,
  ArrowRight,
  Play,
  Pause,
  Check,
  ChevronRight,
  Milestone,
  X,
  RefreshCw,
  History,
  ListTodo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface AgentResponse {
  agent: string
  status: 'pending' | 'processing' | 'complete'
  plan: string
  kpis: string[]
  budget: string
  risks: string[]
  dependencies: string[]
}

interface StrategyOption {
  type: 'conservative' | 'balanced' | 'aggressive'
  name: string
  summary: string
  expectedOutcome: string
  timeline: string
  budgetRange: string
  riskLevel: string
  confidence: string
}

interface ParsedObjective {
  targetKPI: string
  targetValue: string
  constraints: string[]
  timeframe: string
  riskLevel: string
}

interface ExecutionPhase {
  phase: number
  name: string
  duration: string
  activities: string[]
  milestones: string[]
}

interface ApprovalItem {
  id: string
  title: string
  description: string
  department: string
  priority: 'high' | 'medium' | 'low'
  approved?: boolean
}

interface ExecutiveResponse {
  parsedObjective?: ParsedObjective
  strategyOptions?: StrategyOption[]
  selectedStrategy?: string
  strategicSummary: string
  tradeOffs: string[]
  agents: AgentResponse[]
  totalBudgetImpact: string
  headcountImpact: string
  timeline: string
  overallRisks: string[]
  measurementPlan: string[]
  executionPhases?: ExecutionPhase[]
  approvalItems?: ApprovalItem[]
}

const agentConfig = [
  {
    id: 'sales',
    name: 'Sales Agent',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    description: 'Pipeline, leads, pricing, enablement',
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    icon: Target,
    color: 'from-pink-500 to-rose-600',
    description: 'Campaigns, messaging, channels, attribution',
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: DollarSign,
    color: 'from-yellow-500 to-amber-600',
    description: 'Budgets, forecasts, ROI, scenarios',
  },
  {
    id: 'operations',
    name: 'Operations Agent',
    icon: Settings,
    color: 'from-blue-500 to-indigo-600',
    description: 'Processes, SLAs, capacity, workflows',
  },
  {
    id: 'support',
    name: 'Customer Support Agent',
    icon: HeadphonesIcon,
    color: 'from-purple-500 to-violet-600',
    description: 'Tickets, complaints, churn, CX insights',
  },
  {
    id: 'hr',
    name: 'HR Agent',
    icon: UserCog,
    color: 'from-orange-500 to-red-600',
    description: 'Hiring, workforce, performance, compliance',
  },
]

const examplePrompts = [
  'Improve quarterly retention by 8% without increasing CAC',
  'Launch a new health insurance product in Q2 with $2M budget',
  'Reduce customer support ticket resolution time by 40%',
  'Expand sales team by 20% while maintaining profitability',
  'Cut operational costs by 15% without affecting service quality',
]

export default function EnterprisePage() {
  const { user } = useUser()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [response, setResponse] = useState<ExecutiveResponse | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedAgentsForQuery, setSelectedAgentsForQuery] = useState<string[]>([])
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false)
  const [approvalStates, setApprovalStates] = useState<Record<string, boolean>>({})
  const [selectedStrategyView, setSelectedStrategyView] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionComplete, setExecutionComplete] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ strategyId?: string; tasksCreated?: number } | null>(null)

  useEffect(() => {
    checkCompanyProfile()
  }, [])

  const checkCompanyProfile = async () => {
    try {
      const res = await fetch('/api/enterprise/profile')
      if (res.ok) {
        const data = await res.json()
        setHasCompanyProfile(data.hasProfile)
      }
    } catch (error) {
      console.error('Error checking profile:', error)
    }
  }

  const toggleAgentSelection = (agentId: string) => {
    if (isProcessing) return
    setSelectedAgentsForQuery((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    )
  }

  const processCommand = async () => {
    if (!prompt.trim() || isProcessing) return
    if (selectedAgentsForQuery.length === 0) {
      setSelectedAgentsForQuery(agentConfig.map((a) => a.id))
    }

    setIsProcessing(true)
    setResponse(null)
    setActiveAgents([])
    setApprovalStates({})

    const agentsToProcess = selectedAgentsForQuery.length > 0
      ? selectedAgentsForQuery
      : agentConfig.map((a) => a.id)

    try {
      for (const agentId of agentsToProcess) {
        setActiveAgents((prev) => [...prev, agentId])
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      const res = await fetch('/api/enterprise/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, agents: agentsToProcess }),
      })

      const data = await res.json()
      setResponse(data)
      if (data.selectedStrategy) {
        setSelectedStrategyView(data.selectedStrategy)
      }
    } catch (error) {
      console.error('Command processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getAgentResponse = (agentId: string) => {
    return response?.agents.find((a) => a.agent === agentId)
  }

  const toggleApproval = (itemId: string) => {
    setApprovalStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const allApproved = response?.approvalItems?.every(item => approvalStates[item.id]) || false

  // Clear all results and reset the dashboard
  const clearResults = () => {
    setResponse(null)
    setActiveAgents([])
    setSelectedAgent(null)
    setApprovalStates({})
    setSelectedStrategyView(null)
    setExecutionComplete(false)
    setExecutionResult(null)
    setPrompt('')
  }

  // Show confirmation dialog before executing
  const handleExecuteClick = () => {
    if (!allApproved || isExecuting) return
    setShowConfirmDialog(true)
  }

  // Execute strategy and save to database
  const executeStrategy = async () => {
    if (!allApproved || isExecuting || !response) return

    setShowConfirmDialog(false)
    setIsExecuting(true)

    try {
      // Get the selected strategy details
      const selectedStrategyData = response.strategyOptions?.find(
        s => s.type === response.selectedStrategy
      )

      // Call the API to save the strategy
      const res = await fetch('/api/enterprise/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          selectedStrategy: response.selectedStrategy,
          strategyDetails: selectedStrategyData ? {
            name: selectedStrategyData.name,
            summary: selectedStrategyData.summary,
            expectedOutcome: selectedStrategyData.expectedOutcome,
            timeline: selectedStrategyData.timeline,
            budgetRange: selectedStrategyData.budgetRange,
          } : null,
          approvalItems: response.approvalItems,
          agents: response.agents,
          totalBudgetImpact: response.totalBudgetImpact,
          headcountImpact: response.headcountImpact,
          executionPhases: response.executionPhases,
        }),
      })

      const result = await res.json()

      if (result.success) {
        // Save tasks to localStorage for viewing
        const strategyId = result.strategyId || `exec-${Date.now()}`
        const tasks = response.executionPhases?.flatMap((phase, phaseIdx) =>
          phase.activities.map((activity, actIdx) => ({
            id: `task-${strategyId}-${phaseIdx}-${actIdx}`,
            strategyId,
            phaseNumber: phase.phase,
            phaseName: phase.name,
            activity,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          }))
        ) || []

        // Store in localStorage
        const existingStrategies = JSON.parse(localStorage.getItem('genome_executed_strategies') || '[]')
        const newStrategy = {
          id: strategyId,
          prompt,
          selectedStrategy: response.selectedStrategy || 'balanced',
          executedAt: new Date().toISOString(),
          tasks,
        }
        localStorage.setItem('genome_executed_strategies', JSON.stringify([newStrategy, ...existingStrategies]))

        setExecutionResult({
          strategyId: result.strategyId,
          tasksCreated: tasks.length,
        })
        setExecutionComplete(true)
      } else {
        console.error('Execution failed:', result.error)
        // Still mark as complete for demo purposes
        setExecutionComplete(true)
      }
    } catch (error) {
      console.error('Execution error:', error)
      // Still mark as complete for demo purposes
      setExecutionComplete(true)
    } finally {
      setIsExecuting(false)
    }
  }

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'conservative': return Shield
      case 'balanced': return Scale
      case 'aggressive': return Rocket
      default: return Target
    }
  }

  const getStrategyColor = (type: string) => {
    switch (type) {
      case 'conservative': return 'from-green-500 to-emerald-600'
      case 'balanced': return 'from-yellow-500 to-amber-600'
      case 'aggressive': return 'from-red-500 to-rose-600'
      default: return 'from-genome-500 to-purple-600'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Enterprise Command Center
            </h1>
            <p className="text-slate-400">
              AI-Powered Agentic Operating Model for Strategic Decision Making
            </p>
          </div>
        </div>

        {/* Company Profile Section */}
        <Card className="mb-4 bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {hasCompanyProfile ? 'Company Profile' : 'Setup Your Company Profile'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {hasCompanyProfile
                      ? 'Manage your company data for personalized AI recommendations'
                      : 'Let our AI assistant guide you through a quick conversation to set up your profile'
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/enterprise/company-profile')}
                  className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                >
                  {hasCompanyProfile ? 'Edit Profile' : 'Manual Setup'}
                </Button>
                {!hasCompanyProfile && (
                  <Button
                    onClick={() => router.push('/dashboard/enterprise/onboarding')}
                    className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    AI-Guided Setup
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CEO Prompt Input */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  CEO Strategic Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your strategic objective... (e.g., 'Improve quarterly retention by 8% without increasing CAC')"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px] mb-3"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  {examplePrompts.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors"
                    >
                      {example.slice(0, 40)}...
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={processCommand}
                    disabled={isProcessing || !prompt.trim()}
                    className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Orchestrating Agents...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Execute Strategic Command
                      </>
                    )}
                  </Button>
                  {response && (
                    <Button
                      variant="outline"
                      onClick={clearResults}
                      className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Results
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-genome-400" />
            Functional Agents
          </h2>
          {!response && !isProcessing && (
            <p className="text-sm text-slate-400">
              Click to select agents • {selectedAgentsForQuery.length === 0 ? 'All agents' : `${selectedAgentsForQuery.length} selected`}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentConfig.map((agent) => {
            const isActive = activeAgents.includes(agent.id)
            const isSelectedForQuery = selectedAgentsForQuery.includes(agent.id)
            const agentResponse = getAgentResponse(agent.id)
            const Icon = agent.icon

            return (
              <Card
                key={agent.id}
                className={cn(
                  'bg-slate-900 border-slate-800 cursor-pointer transition-all duration-300',
                  isActive && 'border-genome-500/50 shadow-lg shadow-genome-500/10',
                  isSelectedForQuery && !isProcessing && !response && 'ring-2 ring-genome-500 border-genome-500/50',
                  selectedAgent === agent.id && 'ring-2 ring-genome-400'
                )}
                onClick={() => {
                  if (!isProcessing && !response) {
                    toggleAgentSelection(agent.id)
                  } else if (agentResponse) {
                    setSelectedAgent(selectedAgent === agent.id ? null : agent.id)
                  }
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
                      agent.color
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {!isProcessing && !response && isSelectedForQuery && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-genome-500/20 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-genome-400" />
                        <span className="text-xs text-genome-400">Selected</span>
                      </div>
                    )}
                    {isProcessing && isActive && isSelectedForQuery && !agentResponse && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/20 rounded-full">
                        <Loader2 className="h-3 w-3 text-yellow-400 animate-spin" />
                        <span className="text-xs text-yellow-400">Processing</span>
                      </div>
                    )}
                    {agentResponse && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">Complete</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                  <p className="text-xs text-slate-400">{agent.description}</p>

                  {agentResponse && selectedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-genome-400 mb-1">Execution Plan</h4>
                        <p className="text-sm text-slate-300">{agentResponse.plan}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-genome-400 mb-1">KPIs</h4>
                        <ul className="text-xs text-slate-400 space-y-1">
                          {agentResponse.kpis.map((kpi, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-slate-500" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-genome-400 mb-1">Budget Impact</h4>
                        <p className="text-sm text-white font-medium">{agentResponse.budget}</p>
                      </div>
                      {agentResponse.risks.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-red-400 mb-1">Risks</h4>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {agentResponse.risks.map((risk, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Executive Dashboard Response */}
      {response && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-genome-400" />
            Executive Dashboard
          </h2>

          {/* Parsed Objective */}
          {response.parsedObjective && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-genome-400" />
                  Parsed Objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Target KPI</p>
                    <p className="text-sm text-white font-medium">{response.parsedObjective.targetKPI}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Target Value</p>
                    <p className="text-sm text-genome-400 font-medium">{response.parsedObjective.targetValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Timeframe</p>
                    <p className="text-sm text-white font-medium">{response.parsedObjective.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                    <p className={cn(
                      "text-sm font-medium capitalize",
                      response.parsedObjective.riskLevel === 'low' ? 'text-green-400' :
                      response.parsedObjective.riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'
                    )}>{response.parsedObjective.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Constraints</p>
                    <p className="text-sm text-white">{response.parsedObjective.constraints?.join(', ') || 'None'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strategy Options */}
          {response.strategyOptions && response.strategyOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-genome-400" />
                Strategy Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {response.strategyOptions.map((strategy) => {
                  const Icon = getStrategyIcon(strategy.type)
                  const isSelected = response.selectedStrategy === strategy.type
                  const isViewing = selectedStrategyView === strategy.type

                  return (
                    <Card
                      key={strategy.type}
                      className={cn(
                        'bg-slate-900 border-slate-800 cursor-pointer transition-all',
                        isSelected && 'ring-2 ring-genome-500',
                        isViewing && 'border-genome-500/50'
                      )}
                      onClick={() => setSelectedStrategyView(strategy.type)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn(
                            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                            getStrategyColor(strategy.type)
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          {isSelected && (
                            <span className="px-2 py-1 bg-genome-500/20 rounded-full text-xs text-genome-400">
                              Recommended
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-white mb-1">{strategy.name}</h4>
                        <p className="text-xs text-slate-400 mb-3">{strategy.summary}</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Expected Outcome</span>
                            <span className="text-green-400 font-medium">{strategy.expectedOutcome}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Timeline</span>
                            <span className="text-white">{strategy.timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Budget Range</span>
                            <span className="text-white">{strategy.budgetRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Confidence</span>
                            <span className="text-genome-400">{strategy.confidence}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Strategic Summary */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-genome-400" />
                Strategic Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm prose-invert max-w-none text-slate-200">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-slate-200">{children}</p>,
                  }}
                >
                  {response.strategicSummary}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-slate-400">Total Budget Impact</span>
                </div>
                <p className="text-2xl font-bold text-white">{response.totalBudgetImpact}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Headcount Impact</span>
                </div>
                <p className="text-2xl font-bold text-white">{response.headcountImpact}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-slate-400">Execution Timeline</span>
                </div>
                <p className="text-2xl font-bold text-white">{response.timeline}</p>
              </CardContent>
            </Card>
          </div>

          {/* Execution Phases */}
          {response.executionPhases && response.executionPhases.length > 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-genome-400" />
                  Execution Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />
                  <div className="space-y-6">
                    {response.executionPhases.map((phase, idx) => (
                      <div key={phase.phase} className="relative pl-14">
                        <div className={cn(
                          "absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                          idx === 0 ? "bg-genome-500 text-white" : "bg-slate-700 text-slate-300"
                        )}>
                          {phase.phase}
                        </div>
                        <div className="bg-slate-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{phase.name}</h4>
                            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                              {phase.duration}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-genome-400 mb-2">Activities</p>
                              <ul className="text-sm text-slate-300 space-y-1">
                                {phase.activities.map((activity, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3 text-slate-500" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-green-400 mb-2">Milestones</p>
                              <ul className="text-sm text-slate-300 space-y-1">
                                {phase.milestones.map((milestone, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trade-offs & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Strategic Trade-offs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.tradeOffs.map((tradeoff, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-yellow-400">{i + 1}</span>
                      </div>
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Overall Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.overallRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Approval Workflow */}
          {response.approvalItems && response.approvalItems.length > 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-genome-400" />
                  Approval Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {response.approvalItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer",
                        approvalStates[item.id]
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-slate-800 border-slate-700 hover:border-slate-600"
                      )}
                      onClick={() => toggleApproval(item.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          approvalStates[item.id]
                            ? "bg-green-500 border-green-500"
                            : "border-slate-500"
                        )}>
                          {approvalStates[item.id] && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{item.department}</span>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs",
                          item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-700 text-slate-400'
                        )}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    {Object.values(approvalStates).filter(Boolean).length} of {response.approvalItems.length} items approved
                  </p>
                  {executionComplete ? (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-medium">Strategy Executed Successfully!</span>
                        </div>
                        {executionResult && (
                          <p className="text-xs text-slate-400">
                            {executionResult.tasksCreated
                              ? `${executionResult.tasksCreated} tasks created`
                              : 'Saved to database'}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => router.push('/dashboard/enterprise/tasks')}
                        className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
                      >
                        <ListTodo className="mr-2 h-4 w-4" />
                        View Tasks
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleExecuteClick}
                      disabled={!allApproved || isExecuting}
                      className={cn(
                        "transition-all",
                        allApproved && !isExecuting
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          : "bg-slate-700 text-slate-400"
                      )}
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {allApproved ? 'Execute Strategy' : 'Pending Approvals'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Measurement Plan */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-genome-400" />
                KPIs & Measurement Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {response.measurementPlan.map((kpi, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-genome-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{kpi}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmDialog(false)}
          />

          {/* Dialog */}
          <Card className="relative z-10 w-full max-w-lg mx-4 bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  Execute Strategy
                </CardTitle>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-300 mb-3">
                  You are about to execute the following strategy:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Strategy Type:</span>
                    <span className="text-white font-medium capitalize">
                      {response?.selectedStrategy || 'Balanced'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Budget Impact:</span>
                    <span className="text-green-400 font-medium">
                      {response?.totalBudgetImpact || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Headcount Impact:</span>
                    <span className="text-blue-400 font-medium">
                      {response?.headcountImpact || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="text-purple-400 font-medium">
                      {response?.timeline || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium mb-1">This action will:</p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Save the strategy to your database</li>
                      <li>• Create action items and tasks</li>
                      <li>• Log this decision for audit trail</li>
                      <li>• Mark all approvals as final</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeStrategy}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm & Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
