'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Send,
  Loader2,
  Building2,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

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

const ONBOARDING_QUESTIONS = [
  {
    key: 'companyName',
    question: "Welcome to Genome AI Enterprise! I'm here to help set up your company profile. Let's start - **What is your company name?**",
    followUp: "Great! Nice to meet you, {value}.",
  },
  {
    key: 'industry',
    question: "**What industry is your company in?** (e.g., Insurance, Banking, Healthcare, Technology, Retail)",
    followUp: "Perfect, {value} is a great space to be in.",
  },
  {
    key: 'companyType',
    question: "**What type of company is it?** (e.g., Property & Casualty Insurance Provider, SaaS Platform, Retail Chain)",
    followUp: "Got it - {value}.",
  },
  {
    key: 'description',
    question: "**Give me a brief description of your company** - what's your mission and market position?",
    followUp: "Excellent overview!",
  },
  {
    key: 'products',
    question: "**What products or services does your company offer?** (You can list multiple, separated by commas)",
    followUp: "Nice product lineup!",
    isArray: true,
  },
  {
    key: 'customerSegments',
    question: "**Who are your main customer segments?** (e.g., Individual consumers, Small businesses, Enterprise clients)",
    followUp: "Good to know your target customers.",
    isArray: true,
  },
  {
    key: 'competitors',
    question: "**Who are your main competitors?** (List a few key ones)",
    followUp: "It's good to know the competitive landscape.",
    isArray: true,
  },
  {
    key: 'annualRevenue',
    question: "Now let's talk numbers. **What's your approximate annual revenue?** (e.g., $50M, $200M)",
    followUp: "{value} - solid foundation!",
  },
  {
    key: 'employeeCount',
    question: "**How many employees does your company have?**",
    followUp: "Got it, {value} employees.",
  },
  {
    key: 'operationalCosts',
    question: "**What are your approximate annual operational costs?** (e.g., $20M/year)",
    followUp: "Noted.",
  },
  {
    key: 'marketingBudget',
    question: "**What's your annual marketing budget?** (e.g., $5M/year)",
    followUp: "Marketing budget recorded.",
  },
  {
    key: 'salesBudget',
    question: "**What's your annual sales budget?** (e.g., $8M/year)",
    followUp: "Sales budget noted.",
  },
  {
    key: 'goals',
    question: "**What are your main business goals?** (e.g., Increase market share by 10%, Reduce churn, Launch new products)",
    followUp: "Great goals to work towards!",
    isArray: true,
  },
  {
    key: 'challenges',
    question: "**What are your current business challenges?** (e.g., High customer churn, Rising acquisition costs, Operational inefficiency)",
    followUp: "Understanding your challenges helps us provide better recommendations.",
    isArray: true,
  },
  {
    key: 'riskTolerance',
    question: "Last question! **What's your risk tolerance for strategic initiatives?** (low, medium, or high)\n\n- **Low**: Conservative approach, prioritize stability\n- **Medium**: Balanced approach, calculated risks\n- **High**: Aggressive approach, willing to take bigger risks for bigger rewards",
    followUp: "Perfect! Risk tolerance set to {value}.",
    validation: (value: string) => ['low', 'medium', 'high'].includes(value.toLowerCase()),
    transform: (value: string) => value.toLowerCase(),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Partial<CompanyProfile>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start with first question
    setTimeout(() => {
      addAssistantMessage(ONBOARDING_QUESTIONS[0].question)
    }, 500)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addAssistantMessage = (content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content }])
      setIsTyping(false)
    }, 800)
  }

  const handleSubmit = async () => {
    if (!input.trim() || isTyping) return

    const userInput = input.trim()
    setInput('')

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userInput }])

    const currentQuestion = ONBOARDING_QUESTIONS[currentStep]

    // Validate if needed
    if (currentQuestion.validation && !currentQuestion.validation(userInput)) {
      setTimeout(() => {
        addAssistantMessage(`Please enter a valid value. ${currentQuestion.question}`)
      }, 500)
      return
    }

    // Transform value if needed
    let value: string | string[] = currentQuestion.transform
      ? currentQuestion.transform(userInput)
      : userInput

    // Handle array fields
    if (currentQuestion.isArray) {
      value = userInput.split(',').map((s) => s.trim()).filter(Boolean)
    }

    // Update profile
    const updatedProfile = {
      ...profile,
      [currentQuestion.key]: value,
    }
    setProfile(updatedProfile)

    // Show follow-up and next question
    const followUp = currentQuestion.followUp.replace('{value}', Array.isArray(value) ? value.join(', ') : value)

    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      // More questions to ask
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: followUp }])
        setIsTyping(false)

        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          addAssistantMessage(ONBOARDING_QUESTIONS[currentStep + 1].question)
        }, 800)
      }, 600)
    } else {
      // Onboarding complete
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: followUp },
        ])
        setIsTyping(false)

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `🎉 **Excellent! Your company profile is complete!**\n\nHere's a summary:\n\n- **Company:** ${updatedProfile.companyName}\n- **Industry:** ${updatedProfile.industry}\n- **Products:** ${(updatedProfile.products as string[])?.join(', ')}\n- **Revenue:** ${updatedProfile.annualRevenue}\n- **Employees:** ${updatedProfile.employeeCount}\n- **Risk Tolerance:** ${updatedProfile.riskTolerance}\n\nClick the button below to save your profile and start using the Enterprise Command Center!`,
            },
          ])
          setIsComplete(true)
        }, 1000)
      }, 600)
    }
  }

  const saveProfile = async () => {
    setIsSaving(true)

    // Set defaults for any missing fields
    const finalProfile: CompanyProfile = {
      companyName: profile.companyName || '',
      industry: profile.industry || 'Other',
      companyType: profile.companyType || '',
      description: profile.description || '',
      products: (profile.products as string[]) || [],
      customerSegments: (profile.customerSegments as string[]) || [],
      annualRevenue: profile.annualRevenue || '',
      employeeCount: profile.employeeCount || '',
      operationalCosts: profile.operationalCosts || '',
      marketingBudget: profile.marketingBudget || '',
      salesBudget: profile.salesBudget || '',
      goals: (profile.goals as string[]) || [],
      challenges: (profile.challenges as string[]) || [],
      competitors: (profile.competitors as string[]) || [],
      riskTolerance: (profile.riskTolerance as 'low' | 'medium' | 'high') || 'medium',
    }

    try {
      const res = await fetch('/api/enterprise/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: finalProfile }),
      })

      if (res.ok) {
        router.push('/dashboard/enterprise')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Company Setup</h1>
              <p className="text-xs text-slate-400">AI-powered onboarding</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {currentStep + 1} of {ONBOARDING_QUESTIONS.length}
            </span>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-genome-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-genome-500 text-white'
                    : 'bg-slate-800 text-slate-200'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content.split('**').map((part, idx) =>
                    idx % 2 === 1 ? (
                      <strong key={idx} className="font-semibold">{part}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={saveProfile}
                disabled={isSaving}
                size="lg"
                className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Launch Enterprise Command Center
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="border-t border-slate-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder="Type your answer..."
                className="bg-slate-800 border-slate-700 text-white"
                disabled={isTyping}
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isTyping}
                className="bg-genome-500 hover:bg-genome-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
