'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Target,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  Play,
  Building2,
  Users,
  DollarSign,
  Settings,
  HeadphonesIcon,
  UserCog,
  TrendingUp,
  Brain,
  Network,
  Shield,
  MessageSquare,
  Radar,
} from 'lucide-react'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  const agentFeatures = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      name: 'Sales Agent',
      desc: 'Pipeline planning, lead prioritization, pricing support',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: <Target className="h-5 w-5" />,
      name: 'Marketing Agent',
      desc: 'Campaign strategy, channel allocation, attribution',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      name: 'Finance Agent',
      desc: 'Budgeting, forecasting, ROI validation',
      color: 'from-yellow-500 to-amber-600',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      name: 'Operations Agent',
      desc: 'Process optimization, SLA monitoring',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      name: 'Support Agent',
      desc: 'Ticket triage, churn signals, CX insights',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: <UserCog className="h-5 w-5" />,
      name: 'HR Agent',
      desc: 'Hiring plans, workforce strategy, compliance',
      color: 'from-orange-500 to-red-600',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🧬</span>
              </div>
              <span className="text-xl font-bold">Genome AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#enterprise"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Enterprise
              </Link>
              <Link
                href="#features"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button variant="premium" size="lg">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-slate-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="premium" size="lg">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-genome-500/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-genome-500/10 to-transparent rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
            <Building2 className="h-4 w-4 text-genome-400" />
            <span className="text-sm text-slate-300">
              Agentic Enterprise Operating Model
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            AI-Powered{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-genome-400 via-purple-400 to-pink-400">
              Enterprise Command Center
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Steer your enterprise via strategic prompts. Coordinate specialized AI agents
            across Sales, Marketing, Finance, Operations, Support & HR to execute aligned plans.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href={isSignedIn ? '/dashboard/enterprise' : '/sign-up'}>
              <Button variant="premium" size="xl" className="group">
                <Brain className="mr-2 h-5 w-5" />
                Launch Command Center
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xl"
              className="border-genome-500/50 bg-genome-500/10 text-white hover:bg-genome-500/20 hover:border-genome-400"
            >
              <Play className="mr-2 h-5 w-5 text-genome-400" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '6', label: 'AI Agents' },
              { value: 'Ad Intel', label: 'Competitive Analysis' },
              { value: 'Real-Time', label: 'Decision Support' },
              { value: '24/7', label: 'Strategic AI' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-genome-500/20 border border-genome-500/30 mb-6">
              <Network className="h-4 w-4 text-genome-400" />
              <span className="text-sm text-genome-300">Agentic Architecture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">6 Specialized AI Agents</span>
              <br />Working in Harmony
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Issue strategic prompts and watch your AI workforce coordinate, plan, and execute.
              Each agent specializes in a core business function with shared context and goals.
            </p>
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {agentFeatures.map((agent) => (
              <div
                key={agent.name}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-genome-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-genome-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                    <p className="text-sm text-slate-400">{agent.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CEO Orchestration Demo */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-genome-500/10 rounded-full filter blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">CEO Orchestration Layer</h3>
                </div>
                <p className="text-slate-400 mb-6">
                  Simply describe your strategic objective. The orchestration layer breaks it down,
                  routes tasks to relevant agents, resolves conflicts, and delivers aligned execution plans.
                </p>
                <ul className="space-y-3">
                  {[
                    'Accepts natural language strategic prompts',
                    'Auto-delegates to functional agents',
                    'Resolves cross-department conflicts',
                    'Delivers measurable outcomes & KPIs',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-genome-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="text-xs text-genome-400 font-medium mb-2">EXAMPLE PROMPT</div>
                <p className="text-white font-medium mb-4">
                  "Improve quarterly retention by 8% without increasing CAC"
                </p>
                <div className="space-y-2">
                  {agentFeatures.slice(0, 4).map((agent, i) => (
                    <div key={agent.name} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                        {agent.icon}
                      </div>
                      <span className="text-sm text-slate-300">{agent.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Complete AI Marketing Suite{' '}
              <span className="gradient-text">+ Enterprise Command</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful tools for marketers, growth teams, and enterprise leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Building2 className="h-6 w-6" />,
                title: 'Enterprise Command Center',
                description:
                  'CEO-level strategic prompts orchestrated across 6 AI agents for aligned enterprise execution.',
                color: 'from-genome-500 to-purple-600',
                badge: 'CORE',
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: 'AI-Guided Company Profile',
                description:
                  'Conversational onboarding that captures your company data through natural dialogue with AI.',
                color: 'from-cyan-500 to-blue-500',
                badge: 'NEW',
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'Brand Genome Analysis',
                description:
                  'Extract brand personality, positioning, and unique value proposition with AI-powered analysis.',
                color: 'from-genome-500 to-cyan-500',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Strategy Task Management',
                description:
                  'Track execution tasks from strategies with progress monitoring across all phases.',
                color: 'from-orange-500 to-amber-500',
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: 'AI Brand Assistant',
                description:
                  'Personal marketing strategist for content, competitors, audience insights & growth advice.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: <Radar className="h-6 w-6" />,
                title: 'Ad Intelligence Agent',
                description:
                  'Competitive ad analysis, creative strategy, and AI-generated ad concepts with performance predictions.',
                color: 'from-sky-500 to-indigo-500',
                badge: 'NEW',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Approval Workflows',
                description:
                  'Confirmation dialogs, audit trails, and multi-step approval for strategic decisions.',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                {feature.badge && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-genome-500/20 rounded-full">
                    <span className="text-xs font-medium text-genome-400">{feature.badge}</span>
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-genome-600 via-purple-600 to-pink-600 p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-genome-500 via-purple-500 to-pink-500 animate-gradient" />
            <div className="relative bg-slate-950 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Command Your Enterprise?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join forward-thinking leaders using AI agents to coordinate strategy and execution
                across their entire organization.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={isSignedIn ? '/dashboard/enterprise' : '/sign-up'}>
                  <Button variant="premium" size="xl">
                    <Building2 className="mr-2 h-5 w-5" />
                    Launch Enterprise Command
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-400">
                {['No credit card required', '6 AI Agents included', 'Enterprise-ready'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm">🧬</span>
              </div>
              <span className="font-semibold">Genome AI</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 Genome AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
