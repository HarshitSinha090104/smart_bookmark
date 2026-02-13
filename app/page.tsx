'use client'

import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome
        </h1>
        <p className="text-gray-500 mb-8">
          Sign in to manage your bookmarks
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.69 1.22 9.18 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.95c-.56 3-2.24 5.54-4.76 7.26l7.73 6.01c4.51-4.16 7.06-10.29 7.06-17.74z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.9-2.13 15.87-5.81l-7.73-6.01c-2.15 1.45-4.92 2.31-8.14 2.31-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>

          Sign in with Google
        </button>
      </div>
    </main>
  )
}
