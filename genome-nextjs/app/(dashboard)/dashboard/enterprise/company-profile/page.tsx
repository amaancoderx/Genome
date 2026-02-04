'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Building2,
  Save,
  Loader2,
  Package,
  Users,
  DollarSign,
  Target,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  Briefcase,
  TrendingUp,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanyProfile {
  companyName: string
  industry: string
  companyType: string
  description: string
  products: string[]
  customerSegments: string[]
  annualRevenue: string
  employeeCount: string
  operationalCosts: string
  marketingBudget: string
  salesBudget: string
  goals: string[]
  challenges: string[]
  competitors: string[]
  riskTolerance: 'low' | 'medium' | 'high'
}

const defaultProfile: CompanyProfile = {
  companyName: '',
  industry: 'Insurance',
  companyType: '',
  description: '',
  products: [],
  customerSegments: [],
  annualRevenue: '',
  employeeCount: '',
  operationalCosts: '',
  marketingBudget: '',
  salesBudget: '',
  goals: [],
  challenges: [],
  competitors: [],
  riskTolerance: 'medium',
}

const industryTypes = [
  'Insurance',
  'Banking & Finance',
  'Healthcare',
  'Technology',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Consulting',
  'Other',
]

export default function CompanyProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  // Input states for array fields
  const [newProduct, setNewProduct] = useState('')
  const [newSegment, setNewSegment] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [newChallenge, setNewChallenge] = useState('')
  const [newCompetitor, setNewCompetitor] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/enterprise/profile')
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async () => {
    setIsSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/enterprise/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const addToArray = (field: keyof CompanyProfile, value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      setProfile((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }))
      setValue('')
    }
  }

  const removeFromArray = (field: keyof CompanyProfile, index: number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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
          className="text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Command Center
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Company Profile</h1>
              <p className="text-slate-400">
                Manual setup - or use AI-Guided Setup for a conversational experience
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/enterprise/onboarding')}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI-Guided Setup
            </Button>
            <Button
              onClick={saveProfile}
              disabled={isSaving}
              className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-genome-400" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Core details about your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Company Name
              </label>
              <Input
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                placeholder="e.g., SecureLife Insurance Co."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Industry
              </label>
              <select
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-2"
              >
                {industryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Company Type
              </label>
              <Input
                value={profile.companyType}
                onChange={(e) => setProfile({ ...profile, companyType: e.target.value })}
                placeholder="e.g., Property & Casualty Insurance Provider"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Company Description
              </label>
              <Textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Brief description of your company, mission, and market position..."
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products & Services */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-genome-400" />
              Products & Services
            </CardTitle>
            <CardDescription className="text-slate-400">
              What your company offers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Products/Services
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="e.g., Auto Insurance, Health Insurance"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && addToArray('products', newProduct, setNewProduct)}
                />
                <Button
                  onClick={() => addToArray('products', newProduct, setNewProduct)}
                  size="icon"
                  variant="outline"
                  className="border-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-genome-500/20 rounded-full text-sm text-genome-300"
                  >
                    {product}
                    <button onClick={() => removeFromArray('products', i)}>
                      <X className="h-3 w-3 text-genome-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Customer Segments
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value)}
                  placeholder="e.g., Individual consumers, Small businesses"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && addToArray('customerSegments', newSegment, setNewSegment)}
                />
                <Button
                  onClick={() => addToArray('customerSegments', newSegment, setNewSegment)}
                  size="icon"
                  variant="outline"
                  className="border-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.customerSegments.map((segment, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300"
                  >
                    {segment}
                    <button onClick={() => removeFromArray('customerSegments', i)}>
                      <X className="h-3 w-3 text-blue-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Main Competitors
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  placeholder="e.g., State Farm, Geico, Progressive"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && addToArray('competitors', newCompetitor, setNewCompetitor)}
                />
                <Button
                  onClick={() => addToArray('competitors', newCompetitor, setNewCompetitor)}
                  size="icon"
                  variant="outline"
                  className="border-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.competitors.map((competitor, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full text-sm text-red-300"
                  >
                    {competitor}
                    <button onClick={() => removeFromArray('competitors', i)}>
                      <X className="h-3 w-3 text-red-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-genome-400" />
              Financial Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Budget and cost information for AI planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Annual Revenue
                </label>
                <Input
                  value={profile.annualRevenue}
                  onChange={(e) => setProfile({ ...profile, annualRevenue: e.target.value })}
                  placeholder="e.g., $50M"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Employee Count
                </label>
                <Input
                  value={profile.employeeCount}
                  onChange={(e) => setProfile({ ...profile, employeeCount: e.target.value })}
                  placeholder="e.g., 500"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Operational Costs
                </label>
                <Input
                  value={profile.operationalCosts}
                  onChange={(e) => setProfile({ ...profile, operationalCosts: e.target.value })}
                  placeholder="e.g., $20M/year"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Marketing Budget
                </label>
                <Input
                  value={profile.marketingBudget}
                  onChange={(e) => setProfile({ ...profile, marketingBudget: e.target.value })}
                  placeholder="e.g., $5M/year"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Sales Budget
              </label>
              <Input
                value={profile.salesBudget}
                onChange={(e) => setProfile({ ...profile, salesBudget: e.target.value })}
                placeholder="e.g., $8M/year"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals & Risk */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-genome-400" />
              Goals & Risk Tolerance
            </CardTitle>
            <CardDescription className="text-slate-400">
              Strategic objectives and risk preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Business Goals
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g., Increase market share by 10%"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && addToArray('goals', newGoal, setNewGoal)}
                />
                <Button
                  onClick={() => addToArray('goals', newGoal, setNewGoal)}
                  size="icon"
                  variant="outline"
                  className="border-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full text-sm text-green-300"
                  >
                    {goal}
                    <button onClick={() => removeFromArray('goals', i)}>
                      <X className="h-3 w-3 text-green-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Current Challenges
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  placeholder="e.g., High customer churn rate"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && addToArray('challenges', newChallenge, setNewChallenge)}
                />
                <Button
                  onClick={() => addToArray('challenges', newChallenge, setNewChallenge)}
                  size="icon"
                  variant="outline"
                  className="border-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.challenges.map((challenge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full text-sm text-yellow-300"
                  >
                    {challenge}
                    <button onClick={() => removeFromArray('challenges', i)}>
                      <X className="h-3 w-3 text-yellow-400 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Risk Tolerance
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setProfile({ ...profile, riskTolerance: level })}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      profile.riskTolerance === level
                        ? level === 'low'
                          ? 'border-green-500 bg-green-500/20'
                          : level === 'medium'
                          ? 'border-yellow-500 bg-yellow-500/20'
                          : 'border-red-500 bg-red-500/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    )}
                  >
                    <Shield
                      className={cn(
                        'h-6 w-6 mx-auto mb-2',
                        profile.riskTolerance === level
                          ? level === 'low'
                            ? 'text-green-400'
                            : level === 'medium'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                          : 'text-slate-500'
                      )}
                    />
                    <p className="text-sm font-medium text-white capitalize">{level}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {level === 'low'
                        ? 'Conservative'
                        : level === 'medium'
                        ? 'Balanced'
                        : 'Aggressive'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      {profile.companyName && (
        <Card className="mt-6 bg-gradient-to-r from-genome-500/10 to-purple-500/10 border-genome-500/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-genome-400" />
              Profile Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Company</p>
                <p className="text-white font-medium">{profile.companyName}</p>
              </div>
              <div>
                <p className="text-slate-400">Industry</p>
                <p className="text-white font-medium">{profile.industry}</p>
              </div>
              <div>
                <p className="text-slate-400">Products</p>
                <p className="text-white font-medium">{profile.products.length} configured</p>
              </div>
              <div>
                <p className="text-slate-400">Risk Level</p>
                <p className={cn(
                  'font-medium capitalize',
                  profile.riskTolerance === 'low' ? 'text-green-400' :
                  profile.riskTolerance === 'medium' ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {profile.riskTolerance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
