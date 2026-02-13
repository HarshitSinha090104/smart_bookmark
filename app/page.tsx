'use client'

import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </main>
  )
}
