'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Megaphone,
  Loader2,
  CheckCircle2,
  Search,
  Sparkles,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdVariation {
  variationName: string
  creativeDirection: string
  adCopy: {
    headline: string
    primaryText: string
    description: string
    ctaButton: string
  }
  imageUrl?: string
}

interface DiscoveredAd {
  id: string
  brandName: string
  daysRunning: number
  imageUrl: string
  relevanceScore: number
  variations: AdVariation[]
}

interface AdResult {
  keyword: string
  totalAdsFound: number
  relevantAds: number
  ads: DiscoveredAd[]
  pdfUrl?: string
}

type Step = 'input' | 'discovering' | 'generating' | 'results'

export default function AdsPage() {
  const [step, setStep] = useState<Step>('input')
  const [keyword, setKeyword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [businessDesc, setBusinessDesc] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState('')
  const [result, setResult] = useState<AdResult | null>(null)

  const tasks = {
    discovering: [
      { label: 'Searching competitor ads...', progress: 20 },
      { label: 'Analyzing ad relevance...', progress: 40 },
      { label: 'Downloading top performers...', progress: 60 },
    ],
    generating: [
      { label: 'Analyzing ad designs...', progress: 70 },
      { label: 'Creating ad variations...', progress: 85 },
      { label: 'Generating images...', progress: 95 },
    ],
  }

  const startGeneration = async () => {
    if (!keyword.trim() || !companyName.trim()) return

    setStep('discovering')
    setProgress(0)

    try {
      // Discovery phase
      for (const task of tasks.discovering) {
        setCurrentTask(task.label)
        setProgress(task.progress)
        await new Promise((r) => setTimeout(r, 1500))
      }

      setStep('generating')

      // Generation phase
      for (const task of tasks.generating) {
        setCurrentTask(task.label)
        setProgress(task.progress)
        await new Promise((r) => setTimeout(r, 2000))
      }

      const response = await fetch('/api/ads/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          companyName,
          businessDescription: businessDesc,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      setProgress(100)
      setStep('results')
    } catch (error) {
      console.error('Generation failed:', error)
      setStep('input')
    }
  }

  const downloadPdf = () => {
    if (result?.pdfUrl) {
      window.open(result.pdfUrl, '_blank')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const resetGenerator = () => {
    setStep('input')
    setKeyword('')
    setCompanyName('')
    setBusinessDesc('')
    setProgress(0)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Ad Generator</h1>
            <p className="text-slate-400">
              Generate winning ads from competitor intelligence
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
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Discover & Generate Winning Ads
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Enter a keyword to discover top-performing competitor ads
                  and generate customized variations for your brand.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Search Keyword *
                  </label>
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g., divorce lawyer, fitness app, SaaS..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Your Company Name *
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme Law Firm"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Business Description (optional)
                  </label>
                  <Input
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                    placeholder="Brief description of your offer..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <Button
                  onClick={startGeneration}
                  disabled={!keyword.trim() || !companyName.trim()}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Discover & Generate Ads
                </Button>
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg max-w-md mx-auto">
                <h4 className="text-sm font-medium text-white mb-2">
                  How it works:
                </h4>
                <ol className="text-sm text-slate-400 space-y-1">
                  <li>1. We discover top-performing ads in your niche</li>
                  <li>2. AI analyzes ad designs and copy</li>
                  <li>3. Generate 3 variations customized for your brand</li>
                  <li>4. Download as a professional PDF report</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discovering/Generating Steps */}
        {(step === 'discovering' || step === 'generating') && (
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
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{progress}%</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  {step === 'discovering' ? 'Discovering Ads' : 'Generating Variations'}
                </h2>
                <p className="text-orange-400 mb-4">{currentTask}</p>

                <div className="space-y-2 max-w-md mx-auto">
                  {[...tasks.discovering, ...tasks.generating].map((task, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        progress >= task.progress ? 'text-green-400' : 'text-slate-500'
                      )}
                    >
                      {progress >= task.progress ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : progress >= task.progress - 20 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="h-4 w-4" />
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
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Ad Generation Complete!
                      </h2>
                      <p className="text-slate-400">
                        Found {result.totalAdsFound} ads, {result.relevantAds} relevant
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={downloadPdf} variant="premium">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button onClick={resetGenerator} variant="outline">
                      New Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Ads */}
            {result.ads.map((ad, adIndex) => (
              <Card key={ad.id} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-400">
                        {adIndex + 1}
                      </span>
                      {ad.brandName}
                      <span className="text-sm font-normal text-slate-500">
                        • {ad.daysRunning} days running
                      </span>
                    </div>
                    <span className="text-sm font-normal px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                      {ad.relevanceScore}/10 relevance
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Original Ad */}
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">
                      Original Ad
                    </h4>
                    <div className="flex gap-4">
                      {ad.imageUrl && (
                        <img
                          src={ad.imageUrl}
                          alt="Original ad"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 text-sm text-slate-300">
                        <p>Running for {ad.daysRunning} days</p>
                        <p>Relevance Score: {ad.relevanceScore}/10</p>
                      </div>
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {ad.variations.map((variation, i) => (
                      <div
                        key={i}
                        className="p-4 bg-slate-800 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-white">
                            {variation.variationName}
                          </h4>
                          <span className="text-xs text-orange-400">V{i + 1}</span>
                        </div>

                        {variation.imageUrl && (
                          <img
                            src={variation.imageUrl}
                            alt={`Variation ${i + 1}`}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-500">Headline:</span>
                            <p className="text-white">{variation.adCopy.headline}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Primary Text:</span>
                            <p className="text-slate-300 text-xs">
                              {variation.adCopy.primaryText}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                              {variation.adCopy.ctaButton}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${variation.adCopy.headline}\n\n${variation.adCopy.primaryText}`
                                )
                              }
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <Copy className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
