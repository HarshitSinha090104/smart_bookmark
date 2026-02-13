# Smart Bookmark App

🔗 **Live Demo:** https://smart-bookmark-two.vercel.app/

Smart Bookmark is a real-time bookmark management application that allows users to securely save, view, and manage their personal bookmarks using Google authentication. Each user has a private dashboard with instant, real-time updates across tabs and devices.

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth login using Supabase
- Secure session handling
- Dedicated OAuth callback flow

### 🔖 Bookmark Management
- Add bookmarks (Title + URL)
- Delete bookmarks
- Bookmarks are private to each user
- Clean and responsive dashboard UI

### ⚡ Real-Time Updates
- Instant updates when bookmarks are added or deleted
- Works across multiple tabs without page refresh
- Handles first-time inserts correctly

### 🚪 Logout
- Logout button available on the dashboard
- Clears user session securely
- Redirects user back to login page

### 🎨 UI & UX
- Modern gradient-based design
- Glassmorphism cards
- Responsive layout
- Clear hover states and pointer interactions

---

## 🛠 Tech Stack & Platforms Used

### Frontend
- **Next.js (App Router)**
- **React + TypeScript**
- **Tailwind CSS**

### Backend
- **Supabase**
  - Google OAuth Authentication
  - PostgreSQL Database
  - Realtime subscriptions
  - Row Level Security (RLS)

### Deployment & Hosting
- **Vercel** (Frontend hosting & CI/CD)
- **GitHub** (Version control)

---

## 🔐 Security

- Row Level Security (RLS) ensures users can only access their own bookmarks
- No sensitive credentials committed to the repository
- Secure OAuth redirect handling for both local and production environments

---

## ⚠️ Problems Faced & How They Were Solved

### 1. OAuth worked locally but failed after deployment
**Problem:**  
Google login worked on localhost but failed on Vercel.

**Solution:**  
- Configured correct redirect URLs in Supabase
- Enabled session detection using `detectSessionInUrl`
- Added a dedicated OAuth callback route

---

### 2. Realtime updates not working on first insert
**Problem:**  
The first bookmark required a page reload to appear.

**Solution:**  
- Subscribed to Supabase realtime **before** fetching data
- Used optimistic UI updates
- Ensured realtime events were handled correctly from the first interaction

---

### 3. Duplicate bookmarks appearing in production
**Problem:**  
Optimistic insert and realtime insert both updated the UI.

**Solution:**  
- Added client-side temporary IDs
- Replaced optimistic entries when realtime events arrived
- Prevented duplicate rendering

---

## 📦 Local Setup

```bash
git clone https://github.com/your-username/smart-bookmark.git
cd smart-bookmark
npm install
npm run dev
