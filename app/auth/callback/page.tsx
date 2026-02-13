'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const finishAuth = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        router.replace('/')
        return
      }

      router.replace('/dashboard')
    }

    finishAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in…
    </div>
  )
}
