# 🚀 Ready to Deploy - Quick Guide

## ✅ What's Been Fixed

**Problem:** Data wasn't saving to Supabase after deployment.

**Solution:** All pages now use Supabase instead of localStorage!

---

## 📦 Deploy to Vercel (3 Steps)

### **Step 1: Push to Git** (if not already done)

```bash
git add .
git commit -m "Integrate Supabase - data now persists to database"
git push origin main
```

### **Step 2: Deploy on Vercel**

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Add New..." → "Project"**
3. **Import your repository**
4. **Add Environment Variables:**

   ```
   ANTHROPIC_API_KEY=your_anthropic_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   ⚠️ **Copy these from your `.env.local` file!**

5. Click **"Deploy"** ✨

### **Step 3: Configure Supabase**

After deployment, you'll get a URL like: `https://beta-break-xyz.vercel.app`

1. **Go to Supabase Dashboard**
2. **Authentication → URL Configuration**
3. **Add these URLs:**
   - Redirect URL: `https://your-app.vercel.app/**`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`
   - Site URL: `https://your-app.vercel.app`

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. **Sign up** with a new account
3. **Create profile**
4. **Generate workouts**
5. **Schedule a workout**
6. **Check Supabase Dashboard** → Table Editor
   - You should see data in `profiles`, `workouts`, and `scheduled_workouts` tables!

---

## 🎯 What Changed

### **Files Updated:**

1. **`app/training-setup/page.tsx`**
   - ✅ Now saves workouts to Supabase
   - ✅ Schedules workouts to database
   - ✅ Requires authentication

2. **`app/calendar/page.tsx`**
   - ✅ Loads workouts from Supabase
   - ✅ All actions (schedule, complete, delete) update database
   - ✅ Requires authentication

3. **`app/page.tsx`**
   - ✅ Already integrated (from previous step)

---

## 🔍 Quick Verification

### **Browser Console Check:**

Open browser console (F12) and you should see:

```
Workouts saved to Supabase successfully
```

### **Supabase Dashboard Check:**

Go to **Table Editor** and verify:
- ✅ `profiles` table has your profile
- ✅ `workouts` table has generated workouts
- ✅ `scheduled_workouts` table has scheduled items

---

## 🐛 Common Issues

### **"Data not appearing in Supabase"**

**Check:**
1. Environment variables are set in Vercel
2. Supabase redirect URLs include your Vercel domain
3. You're logged in (check auth state)

### **"Row Level Security policy violation"**

**Fix:**
- Run the complete `lib/supabase/schema.sql` in Supabase SQL Editor
- This creates all necessary RLS policies

### **"Failed to fetch profile"**

**Fix:**
- Make sure you created a profile after signing up
- Check Supabase logs for errors

---

## 📊 Your App Now:

- ✅ **Saves to Database** - No more localStorage
- ✅ **User Authentication** - Secure login/signup
- ✅ **Cross-Device Sync** - Access from anywhere
- ✅ **Production Ready** - Can scale to many users
- ✅ **Data Persistence** - Never lose workouts again

---

## 🎉 You're Ready!

Your app is fully integrated with Supabase and ready for production deployment!

**Deploy now and start climbing! 🧗‍♀️**

