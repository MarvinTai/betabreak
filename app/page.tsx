'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSetupForm from '@/components/ProfileSetupForm';
import { ProfileFormData } from '@/types';

export default function Home() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user already has a profile in localStorage
    const existingProfile = localStorage.getItem('userProfile');
    setHasProfile(!!existingProfile);
  }, []);

  const handleProfileSubmit = (data: ProfileFormData) => {
    // Save to localStorage (later can be replaced with API call)
    const profile = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Redirect to training focus page (we'll create this next)
    router.push('/training-setup');
  };

  // Loading state
  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-climbing-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
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
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Your personalized climbing training awaits
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push('/training-setup')}
              className="card-climbing p-8 text-left group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                💪
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Continue Training
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate new workouts and keep crushing your goals
              </p>
              <div className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold">
                Get Started
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
              <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
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
              Let's set up your profile to create personalized training programs that'll take your climbing to the next level
            </p>
          </div>
        </div>
        
        <ProfileSetupForm onSubmit={handleProfileSubmit} />
      </div>
    </main>
  );
}


