'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const finishLogin = async () => {
      await supabase.auth.getSession()
      router.replace('/dashboard')
    }

    finishLogin()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  )
}
