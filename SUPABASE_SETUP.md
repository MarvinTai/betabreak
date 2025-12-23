# Supabase Setup Guide for Beta Break

This guide will walk you through connecting your Beta Break app to Supabase.

## ✅ Step 1: Create Supabase Project (Do This First!)

1. **Go to [supabase.com](https://supabase.com)** and create an account
2. **Click "New Project"**
   - Organization: Create one if you don't have it
   - Project Name: `beta-break`
   - Database Password: Generate and **SAVE IT SECURELY**
   - Region: Choose closest to your location
   - Click **"Create new project"** (takes ~2 minutes)

## ✅ Step 2: Get Your API Credentials

1. In your Supabase project, go to **Project Settings** (⚙️ gear icon)
2. Click **"API"** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## ✅ Step 3: Add Environment Variables

1. **Open your `.env.local` file** (or create it if it doesn't exist)
2. **Add your Supabase credentials:**

```env
# Anthropic API Key (you already have this)
ANTHROPIC_API_KEY=your_existing_key

# Supabase Configuration (ADD THESE)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxx
```

3. **Replace** the placeholder values with your actual credentials from Step 2
4. **Save the file**

## ✅ Step 4: Run Database Migration

1. **Go to your Supabase Dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New query"**
4. **Copy the ENTIRE contents** of `lib/supabase/schema.sql`
5. **Paste into the SQL editor**
6. **Click "Run"** (bottom right)
7. You should see: ✅ Success. No rows returned

This creates all your database tables:
- ✅ profiles
- ✅ workouts
- ✅ scheduled_workouts

## ✅ Step 5: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. **Optional**: Disable email confirmations for development:
   - Go to **Authentication** → **Settings**
   - Scroll to **"Email Confirmations"**
   - Toggle OFF **"Enable email confirmations"** (for dev only!)

## ✅ Step 6: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

The app will now connect to Supabase!

## 📦 What's Already Done

✅ Supabase client installed (`@supabase/supabase-js`)  
✅ Database client created (`lib/supabase/client.ts`)  
✅ Database functions created (`lib/supabase/database.ts`)  
✅ Auth provider created (`lib/supabase/auth.tsx`)  
✅ Database schema ready (`lib/supabase/schema.sql`)  

## 🔄 What Still Needs To Be Done

To complete the migration from localStorage to Supabase, you'll need to:

### 1. Add AuthProvider to Layout

Update `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/lib/supabase/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Create Login/Signup Page

Create `app/auth/page.tsx` with a login form that uses:
- `useAuth()` hook
- `signIn(email, password)` function
- `signUp(email, password)` function

### 3. Update Components to Use Database

Replace localStorage calls with Supabase functions:

**In `app/page.tsx`:**
- Replace `localStorage.getItem('userProfile')` → `getProfile(user.id)`
- Replace `localStorage.setItem('userProfile')` → `createProfile(user.id, data)`

**In `app/training-setup/page.tsx`:**
- Replace `localStorage.getItem('workouts')` → `getWorkouts(user.id)`
- Replace `localStorage.setItem('workouts')` → `createWorkouts(user.id, workouts)`

**In `app/calendar/page.tsx`:**
- Replace `localStorage.getItem('scheduledWorkouts')` → `getScheduledWorkouts(user.id)`
- Replace `localStorage.setItem('scheduledWorkouts')` → `scheduleWorkout()` / `rescheduleWorkout()` / etc.

### 4. Add Protected Routes

Wrap pages that require auth:

```tsx
'use client';

import { useAuth } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'useState';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  // Your page content
}
```

## 🔐 Database Security

The database is already secured with Row Level Security (RLS):
- Users can ONLY see their own data
- Users can ONLY modify their own data
- All queries are automatically filtered by `user_id`

## 🧪 Testing Your Setup

1. **Check if Supabase is connected:**
   - Open browser console
   - Type: `localStorage.getItem('supabase.auth.token')`
   - Should see: `null` (no user yet) or a token string (logged in)

2. **Test database connection:**
   - Go to Supabase Dashboard → Table Editor
   - You should see your 3 tables: profiles, workouts, scheduled_workouts

## 📝 Next Steps

Would you like me to:
1. ✅ Create the login/signup page?
2. ✅ Update all components to use Supabase instead of localStorage?
3. ✅ Add protected route wrappers?
4. ✅ Create a migration script to move localStorage data to Supabase?

Let me know and I'll help you complete the integration! 🚀

