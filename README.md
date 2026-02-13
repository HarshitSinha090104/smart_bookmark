# Smart Bookmark App

🔗 **Live URL:** https://smart-bookmark-two.vercel.app/

Smart Bookmark is a real-time bookmark manager that allows users to securely save, view, and manage their personal bookmarks using Google authentication. Each user gets a private dashboard with instant updates across tabs, without any page refresh.

---

## ✨ Features

- **Google OAuth Authentication**
  - Secure sign-in using Google
  - No email/password handling

- **Private User Data**
  - Each user can only access their own bookmarks
  - Enforced using Supabase Row Level Security (RLS)

- **Real-Time Sync**
  - Bookmarks update instantly across multiple tabs
  - Works for both insert and delete actions

- **Modern UI**
  - Clean, responsive interface
  - Built with Tailwind CSS
  - Gradient background and glassmorphism cards

- **Production Deployment**
  - Deployed on Vercel
  - Environment variables securely managed

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase  
  - Authentication (Google OAuth)  
  - PostgreSQL Database  
  - Realtime subscriptions
- **Deployment:** Vercel

---

## 📂 Application Flow

1. User signs in using Google.
2. OAuth callback completes authentication.
3. User is redirected to the dashboard.
4. Bookmarks are fetched from the database.
5. Realtime listeners update the UI instantly on insert/delete.
6. User can add, delete, and manage bookmarks securely.

---

## 🔐 Security

- Uses Supabase Row Level Security (RLS) to ensure:
  - Users can only read/write their own bookmarks
- No sensitive credentials are committed to the repository
- Only public Supabase keys are used on the client

---

## ⚠️ Problems Faced & Solutions

### 1. OAuth redirect issues on deployment
**Issue:** Authentication worked locally but failed on Vercel.  
**Solution:**  
- Configured correct redirect URLs in Supabase
- Enabled session detection using:
```ts
detectSessionInUrl: true
