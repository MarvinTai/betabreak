'use client';

import { Workout, Exercise } from '@/types';

interface WorkoutDetailProps {
  workout: Workout;
  onClose: () => void;
  onSchedule?: (workout: Workout) => void;
}

export default function WorkoutDetail({ workout, onClose, onSchedule }: WorkoutDetailProps) {
  const renderExercise = (exercise: Exercise, index: number) => (
    <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-black text-xl text-gray-900 dark:text-white flex items-center">
          <span className="text-orange-500 mr-3">{index + 1}.</span>
          {exercise.name}
        </h4>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {exercise.sets && (
          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold shadow-md">
            🔢 {exercise.sets} sets
          </span>
        )}
        {exercise.reps && (
          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-bold shadow-md">
            🔁 {exercise.reps} reps
          </span>
        )}
        {exercise.duration && (
          <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md">
            ⏱️ {exercise.duration}
          </span>
        )}
        {exercise.rest && (
          <span className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl text-sm font-bold shadow-md">
            😌 Rest: {exercise.rest}
          </span>
        )}
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {exercise.instructions}
      </p>
      
      {exercise.notes && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-bold">💡 Note:</span> {exercise.notes}
          </p>
        </div>
      )}
    </div>
  );

  const difficultyConfig = {
    beginner: { color: 'from-green-500 to-emerald-600', icon: '🟢' },
    intermediate: { color: 'from-yellow-500 to-orange-600', icon: '🟡' },
    advanced: { color: 'from-red-500 to-pink-600', icon: '🔴' },
  };

  const config = difficultyConfig[workout.difficulty];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${config.color} p-8 z-10 rock-texture`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{config.icon}</span>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg">
                    {workout.title}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-sm font-bold border border-white/30">
                    ⏱️ {workout.estimatedDuration} minutes
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-sm font-bold border border-white/30">
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </span>
                  {workout.focus.map((focus, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-sm font-bold border border-white/30">
                      🎯 {focus.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-3 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                aria-label="Close"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Overall Notes */}
          {workout.notes && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 rounded-2xl shadow-md">
              <div className="flex items-start">
                <span className="text-4xl mr-4">💬</span>
                <div>
                  <p className="font-black text-blue-900 dark:text-blue-300 mb-2 text-lg">Coach Notes</p>
                  <p className="text-blue-800 dark:text-blue-400 leading-relaxed">{workout.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warmup */}
          {workout.warmup && workout.warmup.length > 0 && (
            <section>
              <div className="flex items-center mb-6 pb-3 border-b-4 border-orange-300">
                <span className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mr-4 text-xl font-bold shadow-lg">
                  1
                </span>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                    🔥 Warmup Phase
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Get your body ready for action</p>
                </div>
              </div>
              <div className="space-y-4">
                {workout.warmup.map((exercise, idx) => renderExercise(exercise, idx))}
              </div>
            </section>
          )}

          {/* Main Exercises */}
          <section>
            <div className="flex items-center mb-6 pb-3 border-b-4 border-blue-300">
              <span className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center mr-4 text-xl font-bold shadow-lg">
                {workout.warmup && workout.warmup.length > 0 ? '2' : '1'}
              </span>
              <div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                  💪 Main Workout
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Time to crush it!</p>
              </div>
            </div>
            <div className="space-y-4">
              {workout.exercises.map((exercise, idx) => renderExercise(exercise, idx))}
            </div>
          </section>

          {/* Cooldown */}
          {workout.cooldown && workout.cooldown.length > 0 && (
            <section>
              <div className="flex items-center mb-6 pb-3 border-b-4 border-green-300">
                <span className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mr-4 text-xl font-bold shadow-lg">
                  {workout.warmup && workout.warmup.length > 0 ? '3' : '2'}
                </span>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                    🧘 Cooldown Phase
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Recover and stretch it out</p>
                </div>
              </div>
              <div className="space-y-4">
                {workout.cooldown.map((exercise, idx) => renderExercise(exercise, idx))}
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 p-6 rounded-b-3xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold rounded-xl transition-all transform hover:scale-105 shadow-md text-lg"
            >
              ← Close
            </button>
            {onSchedule && (
              <button
                onClick={() => {
                  onSchedule(workout);
                  onClose();
                }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                📅 Schedule This Workout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
