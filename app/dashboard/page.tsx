'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
  client_id?: string
}

export default function Dashboard() {
  const router = useRouter()

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/')
        return
      }

      const user = session.user
      setUserId(user.id)

      // ✅ Subscribe FIRST
      channel = supabase
        .channel(`bookmarks-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBookmarks((prev) => {
              // if already exists, skip
              if (prev.some((b) => b.id === payload.new.id)) return prev

              // replace optimistic entry if present
              const withoutOptimistic = prev.filter(
                (b) => !b.client_id
              )

              return [payload.new as Bookmark, ...withoutOptimistic]
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }
        )
        .subscribe()

      // Fetch existing bookmarks
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBookmarks(data ?? [])
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [router])

  const addBookmark = async () => {
    if (!title || !url || !userId) return

    const clientId = crypto.randomUUID()

    const optimisticBookmark: Bookmark = {
      id: clientId,
      client_id: clientId,
      title,
      url,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    setBookmarks((prev) => [optimisticBookmark, ...prev])
    setTitle('')
    setUrl('')

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: userId,
    })

    if (error) {
      setBookmarks((prev) =>
        prev.filter((b) => b.client_id !== clientId)
      )
    }
  }

  const deleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-10 relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-white/90 text-gray-800 font-semibold shadow-md hover:bg-white cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            My Bookmarks
          </h1>
          <p className="text-gray-500">
            Save and manage your important links
          </p>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={addBookmark}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 cursor-pointer"
            >
              Add Bookmark
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-5 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-gray-900 truncate">
                  {b.title}
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  className="text-indigo-600 text-sm hover:underline break-all"
                >
                  {b.url}
                </a>
              </div>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 font-medium hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}

          {bookmarks.length === 0 && (
            <div className="text-center text-white/80 mt-10">
              No bookmarks yet 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
