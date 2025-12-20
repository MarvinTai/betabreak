# Beta Break - Quick Start Guide

## 🚀 You're All Set Up!

Your AI-powered climbing training app is ready to use. Here's how to get started:

## ✅ What's Already Done

1. ✓ Next.js project configured with TypeScript and Tailwind CSS
2. ✓ Profile setup system complete
3. ✓ Training focus selection built
4. ✓ Claude AI integration working
5. ✓ Workout generation and display ready
6. ✓ Dev server running at http://localhost:3000

## 📋 How to Use the App

### Step 1: Create Your Profile (Homepage)
Visit http://localhost:3000 and fill out:
- Your name and climbing experience
- Current climbing grades (V4, 5.11a, etc.)
- Training goals (increase grade, endurance, etc.)
- Available equipment (hangboard, weights, etc.)
- Weekly availability (days per week, minutes per session)
- Any limitations or injuries

Click **"Save Profile & Continue"**

### Step 2: Select Training Focus
You'll be taken to the Training Setup page where you can:
- Choose focus areas (finger strength, power, endurance, etc.)
- Select preferred training days
- Add any additional notes

Click **"Generate Training Program"**

### Step 3: Get AI-Generated Workouts
Wait 10-30 seconds while Claude AI:
- Analyzes your profile
- Creates personalized workouts
- Tailors exercises to your level and equipment

### Step 4: View and Use Workouts
- Browse workout cards showing:
  - Title and focus areas
  - Duration and difficulty
  - Sample exercises
- Click **"View Details"** to see full workout instructions
- Click **"Schedule Workout"** to save (calendar coming soon)

## 🔑 Important Notes

### Your API Key
Make sure your `.env.local` file has your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### Data Storage
- All data is stored in browser localStorage
- Your profile, workouts, and preferences persist between sessions
- Data is private and stays on your device
- To reset: Open browser console and run `localStorage.clear()`

### AI Workout Quality
Claude AI generates:
- Specific exercises with sets/reps/duration
- Detailed instructions for each movement
- Appropriate warmup and cooldown
- Safety notes and coaching tips
- Content tailored to YOUR specific profile

## 🎯 Test the App

### Quick Test Flow:
1. Open http://localhost:3000
2. Fill out profile (use real or test data)
3. Go to training setup
4. Select 2-3 focus areas (e.g., finger strength, endurance)
5. Pick a few preferred days
6. Click "Generate Training Program"
7. Wait for AI to generate workouts
8. Explore the workout cards and details

### Example Profile for Testing:
- Name: Test Climber
- Experience: 2 years
- Bouldering: V4
- Goals: Increase Grade, Build Endurance
- Equipment: Hangboard, Pull-up Bar
- Availability: 3 days/week, 60 min/session

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage with profile setup |
| `app/training-setup/page.tsx` | Training focus and workout generation |
| `app/api/generate-workouts/route.ts` | Claude AI integration |
| `components/ProfileSetupForm.tsx` | Profile input form |
| `components/TrainingFocusForm.tsx` | Training focus selection |
| `components/WorkoutCard.tsx` | Workout preview cards |
| `components/WorkoutDetail.tsx` | Full workout modal |
| `types/profile.ts` | User profile types |
| `types/training.ts` | Workout types |
| `lib/storage.ts` | localStorage utilities |

## 🛠️ Development Commands

```bash
# Start dev server (already running!)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Dev server not running?
```bash
cd /Users/marvintai/Desktop/Beta_Break
npm run dev
```

### API key not working?
1. Check `.env.local` exists in project root
2. Verify API key is correct (starts with `sk-ant-api03-`)
3. Restart dev server after adding key
4. Check browser console for errors

### Workouts not generating?
1. Open browser DevTools (F12) → Console tab
2. Look for error messages
3. Verify API key is loaded (should see "Environments: .env.local" in terminal)
4. Check network tab for API call status

### Reset everything?
Open browser console (F12) and run:
```javascript
localStorage.clear()
location.reload()
```

## 🎨 Customization Ideas

### Easy Customizations:
1. **Colors**: Edit `tailwind.config.ts` to change theme colors
2. **Equipment Options**: Add more in `components/ProfileSetupForm.tsx`
3. **Focus Areas**: Modify in `components/TrainingFocusForm.tsx`
4. **AI Prompt**: Customize in `app/api/generate-workouts/route.ts`

### Next Features to Build:
1. Calendar view for scheduling
2. Workout completion tracking
3. Progress charts and analytics
4. Export workouts to PDF
5. Share workouts with friends

## 🎉 You're Ready!

Your app is fully functional. Try it out:
1. Go to http://localhost:3000
2. Create a profile
3. Generate some workouts
4. See the magic happen!

---

**Questions or issues?** Check the main README.md for detailed documentation.

**Happy Climbing! 🧗‍♀️**


