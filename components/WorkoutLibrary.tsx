'use client';

import { Workout } from '@/types';
import { useState } from 'react';

interface WorkoutLibraryProps {
  workouts: Workout[];
  onSchedule: (workout: Workout, date: Date) => void;
  onViewWorkout: (workout: Workout) => void;
}

export default function WorkoutLibrary({
  workouts,
  onSchedule,
  onViewWorkout,
}: WorkoutLibraryProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleQuickSchedule = (workout: Workout) => {
    const date = new Date(selectedDate);
    onSchedule(workout, date);
  };

  const difficultyColors = {
    beginner: 'from-green-400 to-emerald-500',
    intermediate: 'from-yellow-400 to-orange-500',
    advanced: 'from-red-500 to-pink-600',
  };

  return (
    <div className="card-climbing p-6 sticky top-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <span className="mr-2">💪</span> Workout Library
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Schedule workouts to your calendar
        </p>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Schedule for:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
          />
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-2">🏔️</p>
            <p className="font-semibold">No workouts yet</p>
            <p className="text-sm">Generate workouts to get started</p>
          </div>
        ) : (
          workouts.map(workout => (
            <div
              key={workout.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
            >
              <div className={`bg-gradient-to-r ${difficultyColors[workout.difficulty]} text-white p-2 rounded-lg mb-3`}>
                <h4 className="font-bold text-sm truncate">{workout.title}</h4>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold mr-2">⏱️</span>
                  <span>{workout.estimatedDuration} minutes</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold mr-2">🎯</span>
                  <span className="truncate">
                    {workout.focus.map(f => 
                      f.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                    ).join(', ')}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold mr-2">💪</span>
                  <span>{workout.exercises.length} exercises</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickSchedule(workout)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-bold rounded-lg transition-all transform hover:scale-105"
                >
                  📅 Schedule
                </button>
                <button
                  onClick={() => onViewWorkout(workout)}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-bold rounded-lg transition-colors"
                >
                  👁️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

