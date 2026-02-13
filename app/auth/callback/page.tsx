'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const finishAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    }

    finishAuth()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Signing you in
        </h1>

        <p className="text-gray-500 mb-6">
          Please wait while we set things up for you
        </p>

        {/* Loader */}
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </div>
    </main>
  )
}
