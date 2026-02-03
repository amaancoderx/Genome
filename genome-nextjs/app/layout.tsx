import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genome AI - AI-Powered Marketing Intelligence',
  description:
    'Transform your brand with AI-powered marketing intelligence. Analyze competitors, generate ads, and unlock growth strategies.',
  keywords: [
    'AI marketing',
    'brand analysis',
    'competitor intelligence',
    'ad generation',
    'marketing AI',
  ],
  authors: [{ name: 'Genome AI' }],
  openGraph: {
    title: 'Genome AI - AI-Powered Marketing Intelligence',
    description:
      'Transform your brand with AI-powered marketing intelligence.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
