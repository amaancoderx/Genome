'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  BarChart3,
  Users,
  Target,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: Date
}

interface ChatSession {
  id: string
  brandHandle: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const { user } = useUser()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [brandInput, setBrandInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('genome-chat-sessions')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSessions(parsed)
      if (parsed.length > 0) {
        setCurrentSession(parsed[0])
      }
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('genome-chat-sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const connectBrand = async () => {
    if (!brandInput.trim()) return

    setIsConnecting(true)
    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandHandle: brandInput }),
      })

      const data = await response.json()

      if (data.sessionId) {
        const newSession: ChatSession = {
          id: data.sessionId,
          brandHandle: brandInput,
          messages: [
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: data.welcomeMessage,
              timestamp: new Date(),
            },
          ],
          createdAt: new Date(),
        }

        setSessions((prev) => [newSession, ...prev])
        setCurrentSession(newSession)
        setBrandInput('')
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentSession || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageInput,
      timestamp: new Date(),
    }

    // Add user message immediately
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    }
    setCurrentSession(updatedSession)
    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
    )
    setMessageInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          brandHandle: currentSession.brandHandle,
          message: messageInput,
          history: currentSession.messages,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        imageUrl: data.imageUrl,
        timestamp: new Date(),
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
      }
      setCurrentSession(finalSession)
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? finalSession : s))
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
      }
      setCurrentSession(errorSession)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setCurrentSession(null)
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSession?.id === sessionId) {
      setCurrentSession(null)
    }
  }

  const quickActions = [
    { label: 'What should I post today?', icon: Calendar },
    { label: 'Show competitors with links', icon: Target },
    { label: 'Generate Instagram captions', icon: ImageIcon },
    { label: 'Show audience insights', icon: Users },
    { label: 'Create weekly strategy', icon: BarChart3 },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar - Chat History */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group p-3 rounded-lg cursor-pointer transition-colors',
                currentSession?.id === session.id
                  ? 'bg-genome-500/20 border border-genome-500/30'
                  : 'hover:bg-slate-800'
              )}
              onClick={() => setCurrentSession(session)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.brandHandle}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {session.messages[session.messages.length - 1]?.content?.slice(
                      0,
                      30
                    )}
                    ...
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
              <span className="text-lg">🧬</span>
            </div>
            <div>
              <h1 className="font-semibold text-white">
                {currentSession?.brandHandle || 'Genome AI Chat'}
              </h1>
              <p className="text-xs text-slate-500">
                {currentSession
                  ? 'Your personal marketing strategist'
                  : 'Connect a brand to start'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">AI Ready</span>
          </div>
        </div>

        {/* Messages or Welcome */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentSession ? (
            // Welcome Screen
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Your Personal Brand Strategist
              </h2>
              <p className="text-slate-400 max-w-md mb-8">
                Connect your brand and unlock AI-powered marketing insights,
                content generation, and strategic recommendations.
              </p>

              {/* Brand Input */}
              <div className="w-full max-w-md mb-8">
                <div className="flex gap-2">
                  <Input
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="Enter your brand name, @handle, or website..."
                    className="flex-1 bg-slate-800 border-slate-700 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && connectBrand()}
                  />
                  <Button
                    onClick={connectBrand}
                    disabled={isConnecting || !brandInput.trim()}
                    className="bg-gradient-to-r from-genome-500 to-purple-600"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Connect'
                    )}
                  </Button>
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                {[
                  { icon: '✍️', title: 'Content Creation', desc: 'Generate posts & campaigns' },
                  { icon: '👥', title: 'Audience Insights', desc: 'Understand your personas' },
                  { icon: '🎯', title: 'Competitor Analysis', desc: 'Identify opportunities' },
                  { icon: '📊', title: 'Growth Strategy', desc: 'Actionable roadmaps' },
                ].map((cap) => (
                  <Card
                    key={cap.title}
                    className="p-4 bg-slate-800/50 border-slate-700 hover:border-genome-500/50 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl mb-2">{cap.icon}</div>
                    <h3 className="font-medium text-white text-sm">{cap.title}</h3>
                    <p className="text-xs text-slate-500">{cap.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-slate-700'
                        : 'bg-gradient-to-br from-genome-500 to-purple-600'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-slate-300" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-genome-500 to-purple-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    )}
                  >
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-genome-400 hover:text-genome-300 underline font-medium"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-white font-semibold">{children}</strong>
                          ),
                          hr: () => <div className="my-4" />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={message.imageUrl}
                          alt="Generated"
                          className="rounded-lg max-w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentSession && (
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => setMessageInput(action.label)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs text-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ask anything about your brand..."
                className="flex-1 bg-slate-800 border-slate-700 text-white"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !messageInput.trim()}
                className="bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
