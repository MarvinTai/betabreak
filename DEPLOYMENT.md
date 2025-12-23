# Deployment Guide - Beta Break on Vercel

## ✅ Prerequisites

Before deploying, make sure you have:
- ✓ Supabase project set up with tables created
- ✓ Anthropic API key
- ✓ Git repository (GitHub, GitLab, or Bitbucket)

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Make sure all changes are committed to Git:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

If you haven't initialized Git yet:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in/sign up
2. **Click "Add New..." → "Project"**
3. **Import your Git repository:**
   - Select your GitHub/GitLab/Bitbucket
   - Find your Beta Break repository
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

5. **Add Environment Variables:**
   Click "Environment Variables" and add these **3 variables**:

   ```
   ANTHROPIC_API_KEY=your_anthropic_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   **Important:** Copy these from your `.env.local` file!

6. **Click "Deploy"**
   - Vercel will build and deploy your app (~2-3 minutes)
   - You'll get a URL like: `https://beta-break-xxxxx.vercel.app`

#### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Follow the prompts:**
   - Link to existing project? → No
   - Project name? → beta-break
   - Directory? → ./
   - Override settings? → No

5. **Add environment variables:**
```bash
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

6. **Deploy to production:**
```bash
vercel --prod
```

### Step 3: Configure Supabase for Production

1. **Go to Supabase Dashboard → Authentication → URL Configuration**

2. **Add your Vercel domain to Redirect URLs:**
   ```
   https://your-app-name.vercel.app/**
   https://your-app-name.vercel.app/auth/callback
   ```

3. **Add to Site URL:**
   ```
   https://your-app-name.vercel.app
   ```

### Step 4: Test Your Deployment

1. **Visit your Vercel URL**
2. **Sign up for a new account**
3. **Create a profile**
4. **Generate workouts**
5. **Check Supabase** - data should appear in tables!

## 🔧 Troubleshooting

### Build Fails

**Error: "Cannot find module..."**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to check

**Error: "Environment variable not found"**
- Check that all env vars are added in Vercel dashboard
- Make sure they're spelled correctly (case-sensitive!)

### App Loads But Shows Errors

**"Missing Supabase environment variables"**
- Double-check environment variables in Vercel
- Make sure they start with `NEXT_PUBLIC_` for client-side vars

**Authentication not working**
- Check Supabase URL configuration
- Make sure redirect URLs include your Vercel domain

**Workouts not generating**
- Check Anthropic API key is correct
- Check Vercel function logs: Dashboard → Deployments → Functions tab

### Database Issues

**"Row Level Security policy violation"**
- Make sure you ran the complete schema.sql in Supabase
- Check that RLS policies are created

**Data not saving**
- Open browser console (F12) and check for errors
- Verify Supabase connection in Network tab

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Test sign up flow
- [ ] Test profile creation
- [ ] Test workout generation
- [ ] Test calendar scheduling
- [ ] Check Supabase tables have data
- [ ] Test on mobile device
- [ ] Share your app URL! 🎉

## 🔄 Updating Your Deployment

When you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically detect the push and redeploy! ✨

## 🌐 Custom Domain (Optional)

Want a custom domain like `betabreak.com`?

1. **Buy a domain** (Namecheap, Google Domains, etc.)
2. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions
3. **Update Supabase redirect URLs** with your custom domain

## 🎯 Production Tips

1. **Enable Vercel Analytics** (free):
   - Project Settings → Analytics → Enable

2. **Set up Vercel monitoring:**
   - Get notified of deployment failures
   - Monitor function execution times

3. **Supabase production settings:**
   - Enable email confirmations for security
   - Set up custom email templates
   - Configure rate limiting

4. **Security:**
   - Never commit `.env.local` to Git
   - Rotate API keys periodically
   - Monitor Supabase auth logs

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

Your app is now live! 🚀

