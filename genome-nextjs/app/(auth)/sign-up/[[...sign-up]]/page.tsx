'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-genome-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl">🧬</span>
            </div>
            <span className="text-2xl font-bold text-white">Genome AI</span>
          </Link>
          <p className="mt-3 text-slate-400">
            Create your account and start growing your brand
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-slate-400',
                socialButtonsBlockButton:
                  'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
                socialButtonsBlockButtonText: 'text-white',
                dividerLine: 'bg-slate-600',
                dividerText: 'text-slate-400',
                formFieldLabel: 'text-slate-300',
                formFieldInput:
                  'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500',
                formButtonPrimary:
                  'bg-gradient-to-r from-genome-500 to-purple-600 hover:from-genome-600 hover:to-purple-700',
                footerActionLink: 'text-genome-400 hover:text-genome-300',
                identityPreviewText: 'text-white',
                identityPreviewEditButtonIcon: 'text-genome-400',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
