import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { UserProfile, TrainingFocus, Workout, Exercise } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateWorkoutRequest {
  profile: UserProfile;
  focusAreas: TrainingFocus[];
  preferredDays: string[];
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateWorkoutRequest = await request.json();
    const { profile, focusAreas, preferredDays, notes } = body;

    // Validate required fields
    if (!profile || !focusAreas || focusAreas.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: profile and focusAreas' },
        { status: 400 }
      );
    }

    // Build the prompt for Claude
    const prompt = buildWorkoutGenerationPrompt(profile, focusAreas, preferredDays, notes);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Extract JSON from the response
    const workouts = parseWorkoutsFromResponse(responseText, focusAreas);

    return NextResponse.json({ 
      workouts,
      success: true 
    });

  } catch (error: any) {
    console.error('Error generating workouts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate workouts', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function buildWorkoutGenerationPrompt(
  profile: UserProfile,
  focusAreas: TrainingFocus[],
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

  return `You are an expert climbing coach. Generate personalized training workouts based on the following climber profile:

**Climber Profile:**
- Name: ${profile.name}
- Experience: ${profile.experienceYears} years
- Climbing Levels: ${climbingLevelsStr}
- Goals: ${goalsStr}
- Available Equipment: ${equipmentStr || 'None'}
- Weekly Availability: ${profile.weeklyAvailability.daysPerWeek} days/week, ${profile.weeklyAvailability.minutesPerSession} minutes/session
${limitationsStr ? `- Limitations: ${limitationsStr}` : ''}
${notes ? `- Additional Notes: ${notes}` : ''}

**Training Focus Areas:** ${focusAreas.join(', ')}
**Preferred Training Days:** ${preferredDays.join(', ')}

Please generate ${focusAreas.length} specific, detailed workout(s) - one for each focus area. Each workout should:
1. Be appropriate for the climber's level and goals
2. Use only the available equipment (or bodyweight if no equipment)
3. Respect any limitations mentioned
4. Fit within the time constraints (${profile.weeklyAvailability.minutesPerSession} minutes)
5. Include specific exercises with sets, reps, duration, and rest periods
6. Include warmup and cooldown exercises
7. Be practical and safe

Format your response as a JSON array of workout objects. Each workout should have this structure:
{
  "title": "Descriptive workout title",
  "focus": ["primary_focus_area"],
  "estimatedDuration": number (in minutes),
  "difficulty": "beginner" | "intermediate" | "advanced",
  "warmup": [
    {
      "name": "Exercise name",
      "duration": "time",
      "instructions": "How to perform it"
    }
  ],
  "exercises": [
    {
      "name": "Exercise name",
      "sets": number,
      "reps": number,
      "duration": "time (if applicable)",
      "rest": "rest period",
      "instructions": "Detailed instructions",
      "notes": "Any important notes"
    }
  ],
  "cooldown": [
    {
      "name": "Exercise name",
      "duration": "time",
      "instructions": "How to perform it"
    }
  ],
  "notes": "Overall workout notes and tips"
}

Return ONLY the JSON array, no additional text or markdown formatting.`;
}

function parseWorkoutsFromResponse(responseText: string, focusAreas: TrainingFocus[]): Workout[] {
  try {
    // Try to extract JSON from the response
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }
    
    // Parse the JSON
    const parsedWorkouts = JSON.parse(jsonText);
    
    // Ensure it's an array
    const workoutsArray = Array.isArray(parsedWorkouts) ? parsedWorkouts : [parsedWorkouts];
    
    // Add IDs and timestamps
    const workouts: Workout[] = workoutsArray.map((w: any) => ({
      id: crypto.randomUUID(),
      title: w.title || 'Untitled Workout',
      focus: w.focus || [focusAreas[0]],
      estimatedDuration: w.estimatedDuration || 60,
      difficulty: w.difficulty || 'intermediate',
      exercises: w.exercises || [],
      warmup: w.warmup,
      cooldown: w.cooldown,
      notes: w.notes,
      createdAt: new Date(),
    }));
    
    return workouts;
    
  } catch (error) {
    console.error('Error parsing workouts:', error);
    console.error('Response text:', responseText);
    
    // Return a fallback workout if parsing fails
    return [{
      id: crypto.randomUUID(),
      title: 'Custom Workout',
      focus: focusAreas,
      estimatedDuration: 60,
      difficulty: 'intermediate',
      exercises: [
        {
          name: 'Error generating workout',
          instructions: 'Please try again. The AI response could not be parsed.',
          notes: responseText.substring(0, 200),
        }
      ],
      createdAt: new Date(),
    }];
  }
}


