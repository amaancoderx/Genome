'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, User, Key, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-genome-400" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-genome-500 to-purple-600 flex items-center justify-center text-2xl text-white">
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-white font-medium">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-slate-400 text-sm">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  First Name
                </label>
                <Input
                  value={user?.firstName || ''}
                  disabled
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Last Name
                </label>
                <Input
                  value={user?.lastName || ''}
                  disabled
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Profile information is managed through your Clerk account.
            </p>
          </CardContent>
        </Card>

        {/* API Keys Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-400" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm">
              API keys are configured server-side. Contact support if you need custom API integrations.
            </p>

            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Together AI</p>
                  <p className="text-slate-500 text-sm">Chat & Image Generation</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Supabase</p>
                  <p className="text-slate-500 text-sm">Database & Storage</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  Connected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Report Completion</p>
                <p className="text-slate-500 text-sm">
                  Get notified when your reports are ready
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Product Updates</p>
                <p className="text-slate-500 text-sm">
                  Receive updates about new features
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-slate-500 text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage in Clerk
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Active Sessions</p>
                <p className="text-slate-500 text-sm">
                  Manage your active login sessions
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-slate-900 border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-slate-500 text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
