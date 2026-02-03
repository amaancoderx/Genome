'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  Dna,
  Megaphone,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUser()

  const quickActions = [
    {
      title: 'AI Chat Assistant',
      description: 'Get instant marketing advice and content generation',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'from-genome-500 to-cyan-500',
    },
    {
      title: 'Brand Genome Analysis',
      description: 'Analyze your brand DNA and get strategic insights',
      icon: Dna,
      href: '/dashboard/genome',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI Ad Generator',
      description: 'Generate winning ads from competitor intelligence',
      icon: Megaphone,
      href: '/dashboard/ads',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const stats = [
    { label: 'Chats This Month', value: '0', icon: MessageSquare },
    { label: 'Reports Generated', value: '0', icon: FileText },
    { label: 'Ads Created', value: '0', icon: Megaphone },
    { label: 'Brands Analyzed', value: '0', icon: Dna },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.firstName || 'there'}!
        </h1>
        <p className="text-slate-400">
          Your AI-powered marketing command center awaits.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-genome-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-genome-400 text-sm font-medium group-hover:text-genome-300">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What's New */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-genome-400" />
              What You Can Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: MessageSquare,
                title: 'Chat with AI',
                desc: 'Get personalized marketing advice instantly',
              },
              {
                icon: Dna,
                title: 'Analyze Brand DNA',
                desc: 'Extract your brand personality and positioning',
              },
              {
                icon: Megaphone,
                title: 'Generate Winning Ads',
                desc: 'Create ad variations from competitor analysis',
              },
              {
                icon: TrendingUp,
                title: 'Growth Roadmaps',
                desc: '90-day actionable growth strategies',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-genome-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-genome-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-genome-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
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
              Ready to transform your marketing? Here's how to get the most out
              of Genome AI:
            </p>
            <ol className="space-y-3">
              {[
                'Start a chat with your brand name to get instant insights',
                'Run a Brand Genome Analysis for deep strategic analysis',
                'Use the Ad Generator to create winning ad variations',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-genome-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm">{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/dashboard/chat">
              <Button variant="premium" className="w-full mt-4">
                Start Your First Chat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
