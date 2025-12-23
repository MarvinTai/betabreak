'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrainingFocusForm, { TrainingFocusSelection } from '@/components/TrainingFocusForm';
import WorkoutCard from '@/components/WorkoutCard';
import WorkoutDetail from '@/components/WorkoutDetail';
import { UserProfile, Workout } from '@/types';

type ViewState = 'form' | 'generating' | 'results';

export default function TrainingSetup() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [viewState, setViewState] = useState<ViewState>('form');
  const [generatedWorkouts, setGeneratedWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');

  useEffect(() => {
    // Load profile from localStorage
    const profileData = localStorage.getItem('userProfile');
    if (!profileData) {
      router.push('/');
      return;
    }
    setProfile(JSON.parse(profileData));
  }, [router]);

  const handleGenerateWorkouts = async (focusData: TrainingFocusSelection) => {
    if (!profile || isGenerating) return;

    setIsGenerating(true);
    setViewState('generating');
    setError(null);

    try {
      // Step 1: Start the workout generation job
      const startResponse = await fetch('/api/generate-workouts/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          focusAreas: focusData.focusAreas,
          preferredDays: focusData.preferredDays,
          notes: focusData.notes,
        }),
      });

      let startData;
      try {
        startData = await startResponse.json();
      } catch (parseError) {
        const text = await startResponse.text();
        throw new Error(`Failed to parse start response: ${text}`);
      }

      if (!startResponse.ok) {
        throw new Error(startData.error || 'Failed to start workout generation');
      }

      const { jobId } = startData;
      console.log(`Job started: ${jobId}`);

      // Step 2: Poll for job status
      let attempts = 0;
      const maxAttempts = 180; // 3 minutes max (180 * 1 second)
      const pollInterval = 1000; // 1 second

      const poll = async (): Promise<void> => {
        attempts++;
        
        if (attempts > maxAttempts) {
          throw new Error('Workout generation timed out. Please try again.');
        }

        const statusResponse = await fetch(`/api/generate-workouts/status?jobId=${jobId}`);
        
        let statusData;
        try {
          statusData = await statusResponse.json();
        } catch (parseError) {
          const text = await statusResponse.text();
          console.error('Failed to parse status response:', text);
          throw new Error('Failed to check generation status');
        }

        if (!statusResponse.ok) {
          if (statusResponse.status === 404) {
            throw new Error('Job not found. Please try again.');
          }
          throw new Error(statusData.error || 'Failed to check job status');
        }

        const { status, workouts, error: jobError } = statusData;
        
        console.log(`Job ${jobId} status: ${status} (attempt ${attempts})`);

        if (status === 'done' && workouts) {
          // Success! Save workouts
          setGeneratedWorkouts(workouts);
          
          // Save workouts to localStorage
          const existingWorkouts = localStorage.getItem('workouts');
          const allWorkouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
          const updatedWorkouts = [...allWorkouts, ...workouts];
          localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
          
          // Save training focus selection
          localStorage.setItem('trainingFocus', JSON.stringify(focusData));

          setViewState('results');
        } else if (status === 'error') {
          throw new Error(jobError || 'Failed to generate workouts');
        } else if (status === 'running') {
          // Continue polling
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          await poll();
        }
      };

      await poll();

    } catch (err: any) {
      console.error('Error generating workouts:', err);
      setError(err.message || 'Failed to generate workouts. Please try again.');
      setViewState('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleWorkout = (workout: Workout) => {
    // Create properly structured scheduled workout
    const scheduled = {
      id: crypto.randomUUID(),
      workout: workout, // Full workout object
      scheduledDate: new Date().toISOString(),
      completed: false,
    };
    
    const existingScheduled = localStorage.getItem('scheduledWorkouts');
    const allScheduled = existingScheduled ? JSON.parse(existingScheduled) : [];
    allScheduled.push(scheduled);
    localStorage.setItem('scheduledWorkouts', JSON.stringify(allScheduled));
    
    alert('Workout scheduled! Visit the Calendar to see it.');
  };

  const handleBackToForm = () => {
    setViewState('form');
    setGeneratedWorkouts([]);
    setError(null);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-climbing-pattern py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-6xl">
              {viewState === 'form' && "🎯"}
              {viewState === 'generating' && "⚡"}
              {viewState === 'results' && "🎉"}
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Training Setup
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {viewState === 'form' && "Select your training focus areas to generate personalized workouts"}
            {viewState === 'generating' && "Generating your personalized training program..."}
            {viewState === 'results' && "Your AI-generated training program is ready!"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg">
            <div className="flex items-start">
              <div className="text-3xl mr-3">⚠️</div>
              <div>
                <p className="text-red-900 dark:text-red-300 font-bold text-lg mb-1">
                  Oops! Something went wrong
                </p>
                <p className="text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form View */}
        {viewState === 'form' && (
          <TrainingFocusForm
            onSubmit={handleGenerateWorkouts}
            onBack={() => router.push('/')}
          />
        )}

        {/* Generating View */}
        {viewState === 'generating' && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="card-climbing p-12">
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-orange-500 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🧗
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Crafting Your Perfect Workout...
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Our AI coach is analyzing your profile and creating personalized workouts tailored just for you.
              </p>
              {progressMessage && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">
                    {progressMessage}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-500 font-medium mt-4">
                ⏱️ This usually takes 10-60 seconds...
              </p>
            </div>
          </div>
        )}

        {/* Results View */}
        {viewState === 'results' && (
          <div className="space-y-8">
            {/* Success Message */}
            <div className="max-w-4xl mx-auto rock-texture bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10 flex items-center">
                <div className="text-6xl mr-6">✅</div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Workouts Generated Successfully!
                  </h2>
                  <p className="text-xl text-white/90">
                    {generatedWorkouts.length} personalized workout{generatedWorkouts.length !== 1 ? 's' : ''} created based on your profile and goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Workouts Grid */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    Your Personalized Workouts
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a workout to view full details and instructions
                  </p>
                </div>
                <button
                  onClick={handleBackToForm}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  🔄 Generate New Workouts
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onView={setSelectedWorkout}
                    onSchedule={handleScheduleWorkout}
                  />
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="max-w-4xl mx-auto card-climbing p-8">
              <div className="flex items-start">
                <div className="text-5xl mr-6">💡</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Next Steps
                  </h3>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-3 text-lg">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-3 font-bold">→</span>
                      Click <strong>&quot;View Details&quot;</strong> to see complete workout instructions
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-3 font-bold">→</span>
                      Click <strong>&quot;Schedule Workout&quot;</strong> to add it to your training calendar
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-3 font-bold">→</span>
                      Visit the <button onClick={() => router.push('/calendar')} className="text-blue-600 dark:text-blue-400 underline font-bold hover:text-blue-700">Training Calendar</button> to plan your week
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-3 font-bold">→</span>
                      Generate new workouts anytime to keep your training fresh
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workout Detail Modal */}
        {selectedWorkout && (
          <WorkoutDetail
            workout={selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
            onSchedule={handleScheduleWorkout}
          />
        )}
      </div>
    </main>
  );
}
