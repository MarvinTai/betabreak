import Anthropic from '@anthropic-ai/sdk';
import { UserProfile, TrainingFocus, Workout } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateWorkoutRequest {
  profile: UserProfile;
  focusAreas: TrainingFocus[];
  preferredDays: string[];
  notes?: string;
}

export function buildSingleWorkoutPrompt(
  profile: UserProfile,
  focusArea: TrainingFocus,
  preferredDays: string[],
  notes?: string
): string {
  const climbingLevelsStr = profile.climbingLevels
    .map(l => `${l.discipline}: ${l.grade}`)
    .join(', ');
  
  const equipmentStr = profile.availableEquipment.join(', ');
  const goalsStr = profile.goals.join(', ');
  const limitationsStr = profile.limitations
    .map(l => `${l.type}: ${l.description}`)
    .join('; ');

  // Format focus area for display
  const focusLabel = focusArea.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return `You are an expert climbing coach. Generate ONE personalized training workout for the following climber profile:

**Climber Profile:**
- Name: ${profile.name}
- Experience: ${profile.experienceYears} years
- Climbing Levels: ${climbingLevelsStr}
- Goals: ${goalsStr}
- Available Equipment: ${equipmentStr || 'None'}
- Weekly Availability: ${profile.weeklyAvailability.daysPerWeek} days/week, ${profile.weeklyAvailability.minutesPerSession} minutes/session
${limitationsStr ? `- Limitations: ${limitationsStr}` : ''}
${notes ? `- Additional Notes: ${notes}` : ''}

**Training Focus Area:** ${focusLabel} (${focusArea})
**Preferred Training Days:** ${preferredDays.join(', ')}

Generate ONE specific, detailed workout focused on ${focusLabel}. The workout should:
1. Be appropriate for the climber's level and goals
2. Use only the available equipment (or bodyweight if no equipment)
3. Respect any limitations mentioned
4. Fit within the time constraints (${profile.weeklyAvailability.minutesPerSession} minutes)
5. Include specific exercises with sets, reps, duration, and rest periods
6. Be practical and safe

HARD OUTPUT LIMITS (must follow exactly):
- Return a JSON array with EXACTLY ONE workout object.
- warmup: 2–3 items maximum.
- exercises: 4–6 items maximum.
- cooldown: 1–2 items maximum.
- Each \`instructions\` string must be ≤ 160 characters.
- \`notes\` must be ≤ 200 characters.
- Do NOT include markdown, backticks, the word 'json', or commentary.
- Output must be valid JSON parsable by JSON.parse().

JSON Structure (return exactly this format):
[{
  "title": "Descriptive workout title",
  "focus": ["${focusArea}"],
  "estimatedDuration": number (in minutes, max ${profile.weeklyAvailability.minutesPerSession}),
  "difficulty": "beginner" | "intermediate" | "advanced",
  "warmup": [
    {
      "name": "Exercise name",
      "duration": "time",
      "instructions": "Brief how-to (≤160 chars)"
    }
  ],
  "exercises": [
    {
      "name": "Exercise name",
      "sets": number,
      "reps": number,
      "duration": "time (if applicable)",
      "rest": "rest period",
      "instructions": "Brief instructions (≤160 chars)",
      "notes": "Important notes (≤80 chars, optional)"
    }
  ],
  "cooldown": [
    {
      "name": "Exercise name",
      "duration": "time",
      "instructions": "Brief how-to (≤160 chars)"
    }
  ],
  "notes": "Overall workout notes (≤200 chars)"
}]

Return ONLY the JSON array, nothing else.`;
}

export function parseSingleWorkoutFromResponse(responseText: string, focusArea: TrainingFocus): Workout {
  try {
    // Try to extract JSON from the response
    let jsonText = responseText.trim();
    
    // Check if response seems truncated
    if (jsonText.length < 100) {
      throw new Error('AI response too short - may be truncated. Try again.');
    }
    
    // Remove any markdown code blocks if present (shouldn't happen but just in case)
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }
    
    // Parse the JSON
    const parsedWorkouts = JSON.parse(jsonText);
    
    // Ensure it's an array and get the first workout
    const workoutsArray = Array.isArray(parsedWorkouts) ? parsedWorkouts : [parsedWorkouts];
    
    if (workoutsArray.length === 0) {
      throw new Error('No workout generated. Please try again.');
    }
    
    const w = workoutsArray[0]; // Get first (should be only) workout
    
    // Validate that we have the minimum required fields
    if (!w || typeof w !== 'object') {
      throw new Error('Invalid workout format received from AI');
    }
    
    if (!w.title) {
      throw new Error('Workout missing title - response may be incomplete');
    }
    
    // Build the workout object with defaults
    const workout: Workout = {
      id: crypto.randomUUID(),
      title: w.title || 'Untitled Workout',
      focus: Array.isArray(w.focus) && w.focus.length > 0 ? w.focus : [focusArea],
      estimatedDuration: w.estimatedDuration || 60,
      difficulty: w.difficulty || 'intermediate',
      exercises: Array.isArray(w.exercises) ? w.exercises : [],
      warmup: Array.isArray(w.warmup) ? w.warmup : [],
      cooldown: Array.isArray(w.cooldown) ? w.cooldown : [],
      notes: w.notes || '',
      createdAt: new Date(),
    };
    
    return workout;
    
  } catch (error) {
    console.error(`Error parsing workout for ${focusArea}:`, error);
    console.error('Response text (first 500 chars):', responseText.substring(0, 500));
    
    // Check if it's a JSON parse error with truncated response
    if (error instanceof SyntaxError) {
      throw new Error(`Incomplete AI response for ${focusArea}. JSON parsing failed: ${error.message}`);
    }
    
    // Re-throw other errors
    throw error;
  }
}

export async function generateSingleWorkout(
  profile: UserProfile,
  focusArea: TrainingFocus,
  preferredDays: string[],
  notes?: string
): Promise<Workout> {
  const prompt = buildSingleWorkoutPrompt(profile, focusArea, preferredDays, notes);
  
  // Use reduced max_tokens (1200) and lower temperature (0.4) for reliability
  // This ensures responses are bounded and complete within token limit
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1200,
    temperature: 0.4,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  return parseSingleWorkoutFromResponse(responseText, focusArea);
}

export async function generateAllWorkouts(
  profile: UserProfile,
  focusAreas: TrainingFocus[],
  preferredDays: string[],
  notes?: string
): Promise<Workout[]> {
  const workouts: Workout[] = [];
  
  // Generate workouts sequentially, one focus area at a time
  // This prevents token limit issues and ensures each workout is complete
  // Trade-off: Takes longer but guarantees reliability
  for (const focusArea of focusAreas) {
    console.log(`Generating workout for: ${focusArea}`);
    
    try {
      const workout = await generateSingleWorkout(profile, focusArea, preferredDays, notes);
      workouts.push(workout);
      console.log(`✓ Generated workout: ${workout.title}`);
    } catch (error) {
      console.error(`✗ Failed to generate workout for ${focusArea}:`, error);
      // If one workout fails, throw error to mark entire job as failed
      throw new Error(`Failed to generate workout for ${focusArea}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return workouts;
}

