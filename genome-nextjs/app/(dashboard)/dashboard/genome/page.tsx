'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dna,
  Loader2,
  CheckCircle2,
  Target,
  Users,
  TrendingUp,
  FileText,
  Download,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateGenomeReportPDF } from '@/lib/pdf-generator'

interface AnalysisResult {
  brandDna: {
    personality: { tone: string; values: string[]; archetype: string }
    positioning: { market_position: string; uvp: string; differentiation: string }
    audience: { demographics: string; psychographics: string; pain_points: string[] }
    visual: { colors: string[]; design_language: string; aesthetics: string }
    messaging: { key_messages: string[]; style: string; emotional_appeal: string }
  }
  competitors: {
    competitors: Array<{ name: string; weakness: string; market_share: string }>
    market_gaps: string[]
    opportunities: string[]
    competitive_advantages: string[]
  }
  growthRoadmap: Record<string, unknown>
  contentStrategy: Record<string, unknown>
  pdfUrl?: string
}

type Step = 'input' | 'analyzing' | 'results'

export default function GenomePage() {
  const [step, setStep] = useState<Step>('input')
  const [brandInput, setBrandInput] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analysisTasks = [
    { label: 'Collecting brand data...', progress: 15 },
    { label: 'Analyzing brand DNA...', progress: 30 },
    { label: 'Mapping competitors...', progress: 50 },
    { label: 'Creating growth roadmap...', progress: 70 },
    { label: 'Building content strategy...', progress: 85 },
    { label: 'Generating PDF report...', progress: 95 },
  ]

  const startAnalysis = async () => {
    if (!brandInput.trim()) return

    setStep('analyzing')
    setProgress(0)

    try {
      // Simulate progress updates
      for (const task of analysisTasks) {
        setCurrentTask(task.label)
        setProgress(task.progress)
        await new Promise((r) => setTimeout(r, 1500))
      }

      const response = await fetch('/api/genome/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandInput }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      setProgress(100)
      setStep('results')
    } catch (error) {
      console.error('Analysis failed:', error)
      setStep('input')
    }
  }

  const downloadPdf = () => {
    if (!result) return

    const pdfBlob = generateGenomeReportPDF({
      brandInput,
      brandDna: result.brandDna,
      competitors: result.competitors,
      growthRoadmap: result.growthRoadmap,
      contentStrategy: result.contentStrategy,
    })

    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `genome-analysis-${brandInput.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetAnalysis = () => {
    setStep('input')
    setBrandInput('')
    setProgress(0)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Dna className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Brand Genome Analysis</h1>
            <p className="text-slate-400">
              Extract your brand DNA and get strategic insights
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Input Step */}
        {step === 'input' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Enter Your Brand
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Provide your brand name, website URL, or social media handle
                  to get a comprehensive marketing DNA analysis.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Input
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="e.g., Nike, https://nike.com, @nike"
                  className="bg-slate-800 border-slate-700 text-white h-12 text-center"
                  onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                />
                <Button
                  onClick={startAnalysis}
                  disabled={!brandInput.trim()}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Dna className="mr-2 h-5 w-5" />
                  Analyze Brand DNA
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Dna, label: 'Brand DNA' },
                  { icon: Target, label: 'Competitors' },
                  { icon: TrendingUp, label: 'Growth Plan' },
                  { icon: FileText, label: 'PDF Report' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50"
                  >
                    <item.icon className="h-6 w-6 text-purple-400 mb-2" />
                    <span className="text-xs text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-800"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 3.52} 352`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{progress}%</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  Analyzing {brandInput}
                </h2>
                <p className="text-purple-400 mb-4">{currentTask}</p>

                <div className="space-y-2 max-w-md mx-auto">
                  {analysisTasks.map((task, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        progress >= task.progress ? 'text-green-400' : 'text-slate-500'
                      )}
                    >
                      {progress >= task.progress ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {task.label.replace('...', '')}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Step */}
        {step === 'results' && result && (
          <div className="space-y-6">
            {/* Success Banner */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Analysis Complete!
                      </h2>
                      <p className="text-slate-400">
                        Your Genome Analysis Report is ready
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={downloadPdf} variant="premium">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      New Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand DNA */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Dna className="h-5 w-5 text-purple-400" />
                  Brand DNA
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Personality
                  </h4>
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="text-slate-500">Tone:</span>{' '}
                      {result.brandDna.personality.tone}
                    </p>
                    <p className="text-white">
                      <span className="text-slate-500">Archetype:</span>{' '}
                      {result.brandDna.personality.archetype}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.brandDna.personality.values.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Positioning
                  </h4>
                  <p className="text-white text-sm">
                    {result.brandDna.positioning.uvp}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Competitors */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-400" />
                  Competitor Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.competitors.competitors.slice(0, 4).map((comp, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-800/50 rounded-lg"
                    >
                      <h4 className="font-medium text-white mb-1">{comp.name}</h4>
                      <p className="text-sm text-red-400 mb-2">
                        Weakness: {comp.weakness}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Market Opportunities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.competitors.opportunities.map((opp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded"
                      >
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audience */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Demographics
                    </h4>
                    <p className="text-white text-sm">
                      {result.brandDna.audience.demographics}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Psychographics
                    </h4>
                    <p className="text-white text-sm">
                      {result.brandDna.audience.psychographics}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Pain Points
                    </h4>
                    <ul className="text-white text-sm space-y-1">
                      {result.brandDna.audience.pain_points.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
