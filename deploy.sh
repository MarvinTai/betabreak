#!/bin/bash
# Beta Break - Vercel Deployment Script

echo "🚀 Beta Break - Deploying to Vercel"
echo "===================================="
echo ""

# Check if logged in
echo "Step 1: Login to Vercel..."
vercel login

echo ""
echo "Step 2: Deploying your app..."
vercel

echo ""
echo "⚠️  IMPORTANT: Add environment variables!"
echo "Run these commands:"
echo ""
echo "  vercel env add ANTHROPIC_API_KEY"
echo "  vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "Then deploy to production:"
echo ""
echo "  vercel --prod"
echo ""
echo "✅ After deployment, update Supabase redirect URLs!"
echo "   Go to: Supabase Dashboard → Authentication → URL Configuration"
echo "   Add your Vercel URL"

