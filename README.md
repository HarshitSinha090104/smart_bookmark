# Smart Bookmark App

Smart Bookmark is a simple web app that lets users save and manage bookmarks securely after signing in with Google.

Each user gets their own private bookmark list. Bookmarks update in real time, so if the app is open in multiple tabs, changes appear instantly without refreshing.

---

## What this app does

- Lets users sign in using Google (no email/password)
- Allows users to add bookmarks with a title and URL
- Shows only the logged-in user’s bookmarks
- Updates bookmarks in real time across multiple tabs
- Allows users to delete their own bookmarks
- Works instantly without page reloads

---

## How it works

- **Next.js (App Router)** is used for the frontend
- **Supabase Auth** handles Google login
- **Supabase Database** stores bookmarks
- **Row Level Security (RLS)** ensures users only see their own data
- **Supabase Realtime** listens for insert and delete events and updates the UI instantly
- **Tailwind CSS** is used for clean, simple styling
- The app is deployed on **Vercel**

---

## Live Demo

https://YOUR_VERCEL_URL.vercel.app
