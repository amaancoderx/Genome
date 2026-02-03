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
} from 'lucide-react'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

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
            <Sparkles className="h-4 w-4 text-genome-400" />
            <span className="text-sm text-slate-300">
              AI-Powered Marketing Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Transform Your Brand with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-genome-400 via-purple-400 to-pink-400">
              AI Marketing DNA
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Analyze your brand, discover competitors, generate winning ads, and
            unlock growth strategies - all powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
              <Button variant="premium" size="xl" className="group">
                Start Free Trial
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
              { value: '10K+', label: 'Brands Analyzed' },
              { value: '50M+', label: 'Ads Discovered' },
              { value: '95%', label: 'Accuracy Rate' },
              { value: '24/7', label: 'AI Support' },
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

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Dominate Your Market</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful AI tools designed for modern marketers and growth teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'Brand DNA Analysis',
                description:
                  'Extract your brand personality, positioning, and unique value proposition with AI-powered analysis.',
                color: 'from-genome-500 to-cyan-500',
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Competitor Intelligence',
                description:
                  'Discover competitor weaknesses and market gaps to position your brand for maximum impact.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'AI Ad Generation',
                description:
                  'Generate winning ad variations from top-performing competitor ads with one click.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Growth Roadmaps',
                description:
                  '90-day actionable growth strategies tailored to your brand DNA and market position.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'Content Strategy',
                description:
                  'AI-generated content pillars, posting schedules, and platform-specific optimization.',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'PDF Reports',
                description:
                  'Professional Genome Analysis Reports with actionable insights and visualizations.',
                color: 'from-pink-500 to-rose-500',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
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
                Ready to Transform Your Marketing?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of brands using Genome AI to unlock their full
                marketing potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                  <Button variant="premium" size="xl">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
                {['No credit card required', 'Free tier available', 'Cancel anytime'].map((item) => (
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
