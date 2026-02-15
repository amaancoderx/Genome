'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Radar,
  Loader2,
  CheckCircle2,
  Download,
  Sparkles,
  Target,
  Instagram,
  TrendingUp,
  FileText,
  RotateCcw,
  ImageIcon,
  Palette,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateAdIntelligencePDF } from '@/lib/ad-intelligence-pdf'
import ReactMarkdown from 'react-markdown'

type Step = 'input' | 'generating' | 'results'

interface CreativeReference {
  title: string
  description: string
  imageBase64: string | null
  style: string
  platform: string
}

export default function AdIntelligencePage() {
  const [step, setStep] = useState<Step>('input')
  const [companyName, setCompanyName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [competitorCount, setCompetitorCount] = useState(3)
  const [report, setReport] = useState('')
  const [creativeReferences, setCreativeReferences] = useState<CreativeReference[]>([])
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState('')
  const [error, setError] = useState('')

  const analysisTasks = [
    { label: 'Scanning competitive landscape...', progress: 10 },
    { label: 'Analyzing competitor ad strategies...', progress: 25 },
    { label: 'Evaluating Instagram creative patterns...', progress: 40 },
    { label: 'Identifying positioning gaps...', progress: 55 },
    { label: 'Generating creative ad concepts...', progress: 70 },
    { label: 'Building performance predictions...', progress: 82 },
    { label: 'Compiling intelligence report...', progress: 92 },
    { label: 'Finalizing report...', progress: 97 },
  ]

  const startAnalysis = async () => {
    if (!companyName.trim() || !productDescription.trim()) return

    setStep('generating')
    setProgress(0)
    setError('')

    try {
      let taskIdx = 0
      const progressInterval = setInterval(() => {
        if (taskIdx < analysisTasks.length) {
          setCurrentTask(analysisTasks[taskIdx].label)
          setProgress(analysisTasks[taskIdx].progress)
          taskIdx++
        }
      }, 4000)

      setCurrentTask(analysisTasks[0].label)
      setProgress(analysisTasks[0].progress)

      const response = await fetch('/api/ad-intelligence/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          productDescription,
          targetAudience,
          competitorCount,
        }),
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate report')
      }

      setReport(data.report)
      setCreativeReferences(data.creativeReferences || [])
      setProgress(100)
      setStep('results')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate report. Please try again.')
      setStep('input')
    }
  }

  const downloadPdf = async () => {
    if (!report) return

    const pdfBlob = await generateAdIntelligencePDF(report, companyName, creativeReferences)
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ad-intelligence-${companyName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetAnalysis = () => {
    setStep('input')
    setCompanyName('')
    setProductDescription('')
    setTargetAudience('')
    setCompetitorCount(3)
    setProgress(0)
    setReport('')
    setCreativeReferences([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Ad Intelligence Agent</h1>
            <p className="text-slate-400">
              AI-powered competitive ad analysis, creative strategy, and performance insights
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Input Step */}
        {step === 'input' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-genome-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-genome-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Generate Ad Intelligence Report
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                  Provide your product details and we will analyze competitor ads,
                  generate creative ad concepts, and deliver actionable optimization strategies.
                </p>
              </div>

              {error && (
                <div className="max-w-lg mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="max-w-lg mx-auto space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Name *
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Nike, Glossier, Casper"
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Product / Service Description *
                  </label>
                  <Textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product or service in detail. Include key features, pricing range, and what makes it unique..."
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Audience (Optional)
                  </label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Gen Z fitness enthusiasts, 18-35 year old professionals"
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of Competitors to Analyze
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCompetitorCount(num)}
                        className={cn(
                          'flex-1 h-12 rounded-lg border text-sm font-medium transition-all',
                          competitorCount === num
                            ? 'bg-genome-500/20 border-genome-500 text-genome-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startAnalysis}
                  disabled={!companyName.trim() || !productDescription.trim()}
                  className="w-full h-12 bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
                >
                  <Radar className="mr-2 h-5 w-5" />
                  Generate Intelligence Report
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Target, label: 'Competitor Analysis' },
                  { icon: Instagram, label: 'Creative Intel' },
                  { icon: TrendingUp, label: 'Gap Strategy' },
                  { icon: Palette, label: 'Ad Concepts' },
                  { icon: BarChart3, label: 'KPI Predictions' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50"
                  >
                    <item.icon className="h-6 w-6 text-genome-400 mb-2" />
                    <span className="text-xs text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generating Step */}
        {step === 'generating' && (
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
                      stroke="url(#adGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 3.52} 352`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="adGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{progress}%</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  Analyzing {companyName}
                </h2>
                <p className="text-genome-400 mb-4">{currentTask}</p>

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
        {step === 'results' && report && (
          <div className="space-y-6">
            {/* Success Banner */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Intelligence Report Ready
                      </h2>
                      <p className="text-slate-400">
                        Comprehensive ad intelligence report for {companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={downloadPdf} variant="premium">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      New Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creative Reference Images */}
            {creativeReferences.length > 0 && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="h-5 w-5 text-genome-400" />
                    Creative Ad References
                  </CardTitle>
                  <p className="text-slate-400 text-sm mt-1">
                    AI-generated creative concepts tailored for your brand and audience
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-5">
                    {creativeReferences.map((ref, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden group hover:border-genome-500/50 transition-all"
                      >
                        {/* Image */}
                        {ref.imageBase64 ? (
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={ref.imageBase64}
                              alt={ref.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-slate-800">
                            <div className="text-center">
                              <ImageIcon className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                              <p className="text-slate-500 text-sm">Generating...</p>
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">{ref.title}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-genome-500/20 text-genome-400 font-medium">
                              {ref.platform}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{ref.description}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                              {ref.style}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Content */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-genome-400" />
                  Full Intelligence Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="prose prose-invert prose-slate max-w-none
                  prose-headings:text-white prose-headings:font-semibold
                  prose-h1:text-2xl prose-h1:bg-gradient-to-r prose-h1:from-genome-400 prose-h1:to-purple-400 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:mb-6 prose-h1:pb-2 prose-h1:border-b prose-h1:border-slate-700
                  prose-h2:text-xl prose-h2:text-genome-400 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:text-purple-300 prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-strong:text-white
                  prose-li:text-slate-300
                  prose-ul:text-slate-300
                  prose-ol:text-slate-300
                  prose-table:border-slate-700
                  prose-th:text-slate-200 prose-th:border-slate-700 prose-th:bg-slate-800/50 prose-th:px-4 prose-th:py-2
                  prose-td:text-slate-400 prose-td:border-slate-700 prose-td:px-4 prose-td:py-2
                  prose-hr:border-slate-700
                  prose-a:text-genome-400 prose-a:no-underline hover:prose-a:text-genome-300
                  prose-em:text-slate-400
                ">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-center gap-4 pb-8">
              <Button onClick={downloadPdf} variant="premium" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download PDF Report
              </Button>
              <Button onClick={resetAnalysis} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Generate New Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
