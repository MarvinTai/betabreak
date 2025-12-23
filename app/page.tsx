'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSetupForm from '@/components/ProfileSetupForm';
import { ProfileFormData } from '@/types';
import { useAuth } from '@/lib/supabase/auth';
import { getProfile, createProfile, updateProfile } from '@/lib/supabase/database';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (authLoading) return;
      
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        const profile = await getProfile(user.id);
        setHasProfile(!!profile);
      } catch (error) {
        console.error('Error checking profile:', error);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    }

    checkProfile();
  }, [user, authLoading, router]);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      if (hasProfile) {
        // Update existing profile
        await updateProfile(user.id, data);
        alert('Profile updated successfully! ✅');
        setHasProfile(true); // Return to home view
      } else {
        // Create new profile
        await createProfile(user.id, data);
        router.push('/training-setup');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  // Loading state
  if (authLoading || loading || hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-climbing-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  // If user has profile, show option to edit or continue
  if (hasProfile) {
    return (
      <main className="min-h-screen bg-climbing-pattern py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 rock-texture bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-12 shadow-2xl">
            <div className="relative z-10">
              <div className="inline-block mb-6">
                <div className="text-6xl">🧗</div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">
                Welcome Back, Crusher!
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-4">
                Your personalized climbing training awaits
              </p>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-300 hover:text-white underline"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/training-setup')}
              className="card-climbing p-8 text-left group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                💪
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Generate Workouts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create new personalized training programs with AI
              </p>
              <div className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold">
                Get Started
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => router.push('/calendar')}
              className="card-climbing p-8 text-left group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Training Calendar
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Plan and schedule your climbing workouts
              </p>
              <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                View Calendar
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setHasProfile(false)}
              className="card-climbing p-8 text-left group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Edit Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update your climbing level, goals, and preferences
              </p>
              <div className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                Manage Profile
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // New user - show profile setup form
  return (
    <main className="min-h-screen bg-climbing-pattern py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12 rock-texture bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-12 shadow-2xl">
          <div className="relative z-10">
            <div className="text-7xl mb-6 animate-bounce">🧗</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-lg">
              Beta Break
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your AI-Powered Climbing Coach
            </p>
            <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
              Let&apos;s set up your profile to create personalized training programs that&apos;ll take your climbing to the next level
            </p>
          </div>
        </div>
        
        <ProfileSetupForm onSubmit={handleProfileSubmit} />
      </div>
    </main>
  );
}
