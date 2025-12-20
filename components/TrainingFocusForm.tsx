'use client';

import { useState } from 'react';
import { TrainingFocus } from '@/types';

interface TrainingFocusFormProps {
  onSubmit: (data: TrainingFocusSelection) => void;
  onBack?: () => void;
}

export interface TrainingFocusSelection {
  focusAreas: TrainingFocus[];
  preferredDays: string[]; // e.g., ['monday', 'wednesday', 'friday']
  notes?: string;
}

const FOCUS_OPTIONS: { value: TrainingFocus; label: string; description: string }[] = [
  { 
    value: 'finger_strength', 
    label: 'Finger Strength', 
    description: 'Hangboard training, grip strength, and contact strength'
  },
  { 
    value: 'power', 
    label: 'Power', 
    description: 'Explosive movements, campus board, dynamic climbing'
  },
  { 
    value: 'endurance', 
    label: 'Endurance', 
    description: 'Sustained climbing, ARC training, long routes'
  },
  { 
    value: 'technique', 
    label: 'Technique', 
    description: 'Movement skills, footwork, body positioning'
  },
  { 
    value: 'flexibility', 
    label: 'Flexibility & Mobility', 
    description: 'Stretching, range of motion, injury prevention'
  },
  { 
    value: 'core_strength', 
    label: 'Core Strength', 
    description: 'Body tension, compression moves, roof climbing'
  },
  { 
    value: 'antagonist_training', 
    label: 'Antagonist Training', 
    description: 'Push exercises, shoulder health, injury prevention'
  },
];

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export default function TrainingFocusForm({ onSubmit, onBack }: TrainingFocusFormProps) {
  const [formData, setFormData] = useState<TrainingFocusSelection>({
    focusAreas: [],
    preferredDays: [],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.focusAreas.length === 0) {
      alert('Please select at least one training focus area');
      return;
    }
    if (formData.preferredDays.length === 0) {
      alert('Please select at least one preferred training day');
      return;
    }
    onSubmit(formData);
  };

  const toggleFocus = (focus: TrainingFocus) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(focus)
        ? prev.focusAreas.filter(f => f !== focus)
        : [...prev.focusAreas, focus],
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      {/* Training Focus Areas */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-5xl mr-4">🎯</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Select Training Focus Areas</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose the areas you want to improve - AI will generate specific workouts for each
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOCUS_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`block p-5 border-2 rounded-2xl cursor-pointer transition-all transform hover:scale-102 ${
                formData.focusAreas.includes(option.value)
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg scale-102'
                  : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={formData.focusAreas.includes(option.value)}
                  onChange={() => toggleFocus(option.value)}
                  className="mt-1 w-6 h-6 text-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Preferred Training Days */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-5xl mr-4">📅</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Preferred Training Days</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select the days you prefer to train (helps AI schedule workouts appropriately)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map(day => (
            <label
              key={day.value}
              className={`flex items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${
                formData.preferredDays.includes(day.value)
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.preferredDays.includes(day.value)}
                onChange={() => toggleDay(day.value)}
                className="sr-only"
              />
              <span className="font-bold text-center">{day.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Additional Notes */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-5xl mr-4">📝</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Additional Notes</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Any specific preferences or requirements for your training program?
            </p>
          </div>
        </div>
        
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all resize-none"
          rows={4}
          placeholder="e.g., 'Focus on outdoor climbing preparation', 'Recovering from finger injury', 'Training for competition in 3 months'"
        />
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
          >
            ← Back to Profile
          </button>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto btn-climbing px-12 py-4 text-lg"
        >
          Generate Training Program →
        </button>
      </div>
    </form>
  );
}


