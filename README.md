# Beta Break

AI-powered climbing training app that helps climbers create personalized training programs powered by Claude AI.

## Features

### ✅ Completed
- **Profile Setup** - Comprehensive form to capture climbing level, goals, equipment, and availability
- **Training Focus Selection** - Choose specific areas to train (finger strength, power, endurance, etc.)
- **AI Workout Generation** - Claude AI generates personalized workouts based on your profile
- **Workout Management** - View detailed workout instructions, save and organize workouts
- **Local Storage** - All data persisted locally for quick access

### 🚧 Coming Soon
- Training Calendar - Visual calendar to schedule workouts
- Progress Tracking - Log completed workouts and track improvement
- Workout History - Review past training sessions
- Mobile Responsive Design Improvements

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude 3.5 Sonnet (Anthropic)
- **Storage:** Local Storage (MVP)

## Getting Started

### Prerequisites

- Node.js 20+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the project root:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### 1. Create Your Profile
- Enter your name and climbing experience
- Add your climbing levels for different disciplines (bouldering, sport, trad)
- Select your training goals (increase grade, build endurance, etc.)
- Choose available equipment
- Set weekly availability (days per week, session length)
- Add any limitations or injuries

### 2. Select Training Focus
- Choose areas you want to improve (finger strength, power, endurance, etc.)
- Select preferred training days
- Add any additional notes or preferences

### 3. Generate AI Workouts
- Click "Generate Training Program"
- Claude AI analyzes your profile and creates personalized workouts
- Each workout is tailored to your level, goals, and available equipment

### 4. View and Use Workouts
- Browse generated workouts in card format
- Click "View Details" to see complete exercise instructions
- Each workout includes warmup, main exercises, and cooldown
- Save workouts for future use

## Project Structure

```
beta-break/
├── app/
│   ├── api/
│   │   └── generate-workouts/    # Claude AI integration
│   │       └── route.ts
│   ├── training-setup/            # Training focus and workout generation
│   │   └── page.tsx
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/Profile setup
│   └── globals.css                # Global styles
├── components/
│   ├── ProfileSetupForm.tsx       # User profile form
│   ├── TrainingFocusForm.tsx      # Training focus selection
│   ├── WorkoutCard.tsx            # Workout preview card
│   └── WorkoutDetail.tsx          # Full workout modal
├── lib/
│   └── storage.ts                 # LocalStorage utilities
├── types/
│   ├── profile.ts                 # User profile types
│   ├── training.ts                # Workout types
│   └── index.ts                   # Type exports
└── package.json
```

## API Routes

### POST `/api/generate-workouts`

Generates personalized workouts using Claude AI.

**Request Body:**
```json
{
  "profile": UserProfile,
  "focusAreas": ["finger_strength", "endurance"],
  "preferredDays": ["monday", "wednesday", "friday"],
  "notes": "Optional additional context"
}
```

**Response:**
```json
{
  "workouts": [Workout[]],
  "success": true
}
```

## Data Models

### UserProfile
- Basic info (name, experience)
- Climbing levels and disciplines
- Training goals
- Available equipment
- Weekly availability
- Limitations

### Workout
- Title and description
- Focus areas
- Difficulty level
- Estimated duration
- Warmup exercises
- Main exercises
- Cooldown exercises
- Coach notes

### Exercise
- Name
- Sets, reps, duration
- Rest periods
- Detailed instructions
- Additional notes

## Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Future Enhancements

1. **Calendar Integration** - Visual calendar for scheduling workouts
2. **Progress Tracking** - Log completions, track metrics over time
3. **Workout Library** - Save and organize custom workout templates
4. **Social Features** - Share workouts with friends
5. **Mobile App** - Native mobile experience
6. **Backend Integration** - Replace localStorage with database
7. **Advanced Analytics** - Visualize training progress and trends
8. **Export Features** - Download workouts as PDF

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for the climbing community**
