import { NextRequest, NextResponse } from 'next/server';
import { generateAllWorkouts, GenerateWorkoutRequest } from '../_lib';
import { cleanupOldJobs, createJob, updateJob } from '../_jobStore';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Cleanup old jobs on each request
    cleanupOldJobs();

    const body: GenerateWorkoutRequest = await request.json();
    const { profile, focusAreas, preferredDays, notes } = body;

    // Validate required fields
    if (!profile || !focusAreas || focusAreas.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: profile and focusAreas' },
        { status: 400 }
      );
    }

    // Create job ID
    const jobId = crypto.randomUUID();
    
    // Create job record
    createJob(jobId);
    
    console.log(`[Job ${jobId}] Started workout generation`);

    // Fire-and-forget: Start async generation without awaiting
    // This runs in the background on the server
    (async () => {
      try {
        console.log(`[Job ${jobId}] Generating ${focusAreas.length} workout(s) sequentially...`);
        
        const workouts = [];
        
        // Generate workouts one at a time to prevent token limit issues
        // This ensures each workout is complete and within token budget
        for (let i = 0; i < focusAreas.length; i++) {
          const focusArea = focusAreas[i];
          const focusLabel = focusArea.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          
          updateJob(jobId, { 
            progress: `Creating workout ${i + 1}/${focusAreas.length}: ${focusLabel}...`,
            updatedAt: new Date()
          });
          
          console.log(`[Job ${jobId}] Generating workout ${i + 1}/${focusAreas.length}: ${focusArea}`);
          
          try {
            const { generateSingleWorkout } = await import('../_lib');
            const workout = await generateSingleWorkout(profile, focusArea, preferredDays, notes);
            workouts.push(workout);
            console.log(`[Job ${jobId}] ✓ Generated: ${workout.title}`);
          } catch (error: any) {
            console.error(`[Job ${jobId}] ✗ Failed to generate workout for ${focusArea}:`, error);
            throw new Error(`Failed to generate workout for ${focusLabel}: ${error.message}`);
          }
        }
        
        console.log(`[Job ${jobId}] Successfully generated ${workouts.length} workout(s)`);
        
        updateJob(jobId, {
          status: 'done',
          workouts,
          progress: 'All workouts ready!',
        });
      } catch (error: any) {
        console.error(`[Job ${jobId}] Error generating workouts:`, error);
        
        updateJob(jobId, {
          status: 'error',
          error: error.message || 'Failed to generate workouts',
          errorStack: error.stack,
          progress: 'Error occurred',
        });
      }
    })();

    // Immediately return the job ID to the client
    return NextResponse.json({ 
      jobId,
      message: 'Workout generation started'
    });

  } catch (error: any) {
    console.error('Error starting workout generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start workout generation', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

