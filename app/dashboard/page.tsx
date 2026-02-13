'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBookmarks(data ?? [])

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
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
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
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const addBookmark = async () => {
    if (!title || !url || !userId) return

    await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: userId,
    })

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7ff', padding: 40 }}>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <h1 style={{ marginBottom: 20, color: '#111' }}>My Bookmarks</h1>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 10,
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            color: '#111',
          }}
        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 12,
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            color: '#111',
          }}
        />

        <button
          onClick={addBookmark}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 30,
          }}
        >
          Add Bookmark
        </button>

        {bookmarks.map((b) => (
          <div
            key={b.id}
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <a href={b.url} target="_blank" style={{ color: '#4f46e5' }}>
                {b.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              style={{
                background: 'transparent',
                color: '#ef4444',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
