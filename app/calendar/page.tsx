'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/components/CalendarView';
import WorkoutLibrary from '@/components/WorkoutLibrary';
import WorkoutDetail from '@/components/WorkoutDetail';
import { Workout } from '@/types';
import { ScheduledWorkout } from '@/types/calendar';
import { useAuth } from '@/lib/supabase/auth';
import { 
  getProfile, 
  getWorkouts, 
  getScheduledWorkouts,
  scheduleWorkout,
  rescheduleWorkout,
  completeWorkout,
  deleteScheduledWorkout
} from '@/lib/supabase/database';

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && user) {
        setLoading(true);
        try {
          // Load profile
          const userProfile = await getProfile(user.id);
          if (!userProfile) {
            alert('Please set up your profile first.');
            router.push('/');
            return;
          }
          setProfile(userProfile);

          // Load workouts
          const workouts = await getWorkouts(user.id);
          setAvailableWorkouts(workouts);

          // Load scheduled workouts
          const scheduled = await getScheduledWorkouts(user.id);
          setScheduledWorkouts(scheduled);
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('Failed to load calendar data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        router.push('/auth');
      }
    };
    fetchData();
  }, [user, authLoading, router]);

  const handleScheduleWorkout = async (workout: Workout, date: Date) => {
    if (!user) return;

    try {
      await scheduleWorkout(user.id, workout.id!, date);
      // Refresh scheduled workouts
      const scheduled = await getScheduledWorkouts(user.id);
      setScheduledWorkouts(scheduled);
    } catch (error) {
      console.error('Error scheduling workout:', error);
      alert('Failed to schedule workout. Please try again.');
    }
  };

  const handleRescheduleWorkout = async (scheduledId: string, newDate: Date) => {
    if (!user) return;

    try {
      await rescheduleWorkout(user.id, scheduledId, newDate);
      // Update local state
      const updated = scheduledWorkouts.map(sw =>
        sw.id === scheduledId
          ? { ...sw, scheduledDate: newDate.toISOString() }
          : sw
      );
      setScheduledWorkouts(updated);
    } catch (error) {
      console.error('Error rescheduling workout:', error);
      alert('Failed to reschedule workout. Please try again.');
    }
  };

  const handleDeleteScheduled = async (scheduledId: string) => {
    if (!user) return;

    try {
      await deleteScheduledWorkout(user.id, scheduledId);
      // Update local state
      const updated = scheduledWorkouts.filter(sw => sw.id !== scheduledId);
      setScheduledWorkouts(updated);
    } catch (error) {
      console.error('Error deleting scheduled workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  const handleCompleteWorkout = async (scheduledId: string) => {
    if (!user) return;

    try {
      const workout = scheduledWorkouts.find(sw => sw.id === scheduledId);
      if (!workout) return;

      const newCompletedStatus = !workout.completed;
      await completeWorkout(user.id, scheduledId, newCompletedStatus);
      
      // Update local state
      const updated = scheduledWorkouts.map(sw =>
        sw.id === scheduledId
          ? { 
              ...sw, 
              completed: newCompletedStatus, 
              completedAt: newCompletedStatus ? new Date().toISOString() : undefined 
            }
          : sw
      );
      setScheduledWorkouts(updated);
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('Failed to update workout status. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-climbing-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-climbing-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-5xl mr-4">📅</div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Training Calendar
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Plan and track your climbing workouts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                {showLibrary ? '📅 Hide Library' : '💪 Workout Library'}
              </button>
              <button
                onClick={() => router.push('/training-setup')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                ➕ Generate New Workouts
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className={showLibrary ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <CalendarView
              scheduledWorkouts={scheduledWorkouts}
              onReschedule={handleRescheduleWorkout}
              onDelete={handleDeleteScheduled}
              onComplete={handleCompleteWorkout}
              onViewWorkout={setSelectedWorkout}
            />
          </div>

          {/* Workout Library Sidebar */}
          {showLibrary && (
            <div className="lg:col-span-1">
              <WorkoutLibrary
                workouts={availableWorkouts}
                onSchedule={handleScheduleWorkout}
                onViewWorkout={setSelectedWorkout}
              />
            </div>
          )}
        </div>

        {/* Workout Detail Modal */}
        {selectedWorkout && (
          <WorkoutDetail
            workout={selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
            onSchedule={(workout) => {
              // Schedule for today by default
              handleScheduleWorkout(workout, new Date());
              setSelectedWorkout(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

