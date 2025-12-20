'use client';

import { Workout, Exercise } from '@/types';

interface WorkoutCardProps {
  workout: Workout;
  onSchedule?: (workout: Workout) => void;
  onView?: (workout: Workout) => void;
}

export default function WorkoutCard({ workout, onSchedule, onView }: WorkoutCardProps) {
  const focusLabels = workout.focus.map(f => 
    f.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  ).join(', ');

  const difficultyConfig = {
    beginner: {
      bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
      text: 'text-white',
      icon: '🟢'
    },
    intermediate: {
      bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      text: 'text-white',
      icon: '🟡'
    },
    advanced: {
      bg: 'bg-gradient-to-br from-red-500 to-pink-600',
      text: 'text-white',
      icon: '🔴'
    },
  };

  const config = difficultyConfig[workout.difficulty];

  return (
    <div className="card-climbing overflow-hidden group">
      {/* Header with Gradient */}
      <div className={`${config.bg} p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/30 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">{config.icon}</div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                {workout.estimatedDuration} min
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
            {workout.title}
          </h3>
          <div className="flex items-center text-white/90 text-sm font-semibold">
            <span className="mr-2">🎯</span>
            <span>{focusLabels}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 bg-white dark:bg-gray-800">
        {/* Workout Structure */}
        <div className="space-y-3 mb-5">
          {workout.warmup && workout.warmup.length > 0 && (
            <div className="flex items-center text-sm bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl">
              <span className="text-2xl mr-3">🔥</span>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">Warmup: </span>
                <span className="text-gray-600 dark:text-gray-400">{workout.warmup.length} exercises</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
            <span className="text-2xl mr-3">💪</span>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">Main Workout: </span>
              <span className="text-gray-600 dark:text-gray-400">{workout.exercises.length} exercises</span>
            </div>
          </div>

          {workout.cooldown && workout.cooldown.length > 0 && (
            <div className="flex items-center text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
              <span className="text-2xl mr-3">🧘</span>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">Cooldown: </span>
                <span className="text-gray-600 dark:text-gray-400">{workout.cooldown.length} exercises</span>
              </div>
            </div>
          )}
        </div>

        {/* Sample Exercises */}
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span className="mr-2">📋</span> Sample Exercises:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            {workout.exercises.slice(0, 3).map((exercise, idx) => (
              <li key={idx} className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <span className="text-orange-500 mr-2 font-bold">→</span>
                <span className="font-medium">{exercise.name}</span>
              </li>
            ))}
            {workout.exercises.length > 3 && (
              <li className="text-orange-600 dark:text-orange-400 font-semibold pl-2">
                + {workout.exercises.length - 3} more exercises
              </li>
            )}
          </ul>
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="mb-5 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border-l-4 border-yellow-400">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-bold">💡 Coach Notes:</span>
              <br />
              <span className="mt-1 inline-block">{workout.notes.substring(0, 100)}{workout.notes.length > 100 ? '...' : ''}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onView && (
            <button
              onClick={() => onView(workout)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              👁️ View Details
            </button>
          )}
          {onSchedule && (
            <button
              onClick={() => onSchedule(workout)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              📅 Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
