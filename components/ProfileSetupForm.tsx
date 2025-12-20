'use client';

import { useState } from 'react';
import { 
  ProfileFormData, 
  ClimbingDiscipline, 
  Equipment, 
  TrainingGoal,
  ClimbingLevel,
  Limitation 
} from '@/types';

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileFormData) => void;
  initialData?: ProfileFormData;
}

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'hangboard', label: 'Hangboard' },
  { value: 'campus_board', label: 'Campus Board' },
  { value: 'systems_wall', label: 'Systems Wall' },
  { value: 'resistance_bands', label: 'Resistance Bands' },
  { value: 'weights', label: 'Weights' },
  { value: 'pull_up_bar', label: 'Pull-up Bar' },
  { value: 'rings', label: 'Rings' },
  { value: 'none', label: 'None' },
];

const GOAL_OPTIONS: { value: TrainingGoal; label: string }[] = [
  { value: 'increase_grade', label: 'Increase Grade Level' },
  { value: 'build_endurance', label: 'Build Endurance' },
  { value: 'prevent_injury', label: 'Prevent Injury' },
  { value: 'improve_technique', label: 'Improve Technique' },
  { value: 'competition_prep', label: 'Competition Prep' },
  { value: 'general_fitness', label: 'General Fitness' },
];

const DISCIPLINE_OPTIONS: { value: ClimbingDiscipline; label: string }[] = [
  { value: 'bouldering', label: 'Bouldering' },
  { value: 'sport', label: 'Sport Climbing' },
  { value: 'trad', label: 'Trad Climbing' },
  { value: 'mixed', label: 'Mixed' },
];

export default function ProfileSetupForm({ onSubmit, initialData }: ProfileSetupFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(
    initialData || {
      name: '',
      climbingLevels: [{ discipline: 'bouldering', grade: '' }],
      goals: [],
      availableEquipment: [],
      weeklyAvailability: {
        daysPerWeek: 3,
        minutesPerSession: 60,
      },
      limitations: [],
      experienceYears: 0,
    }
  );

  const [newLimitation, setNewLimitation] = useState({ type: 'other' as const, description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleEquipment = (equipment: Equipment) => {
    setFormData(prev => ({
      ...prev,
      availableEquipment: prev.availableEquipment.includes(equipment)
        ? prev.availableEquipment.filter(e => e !== equipment)
        : [...prev.availableEquipment, equipment],
    }));
  };

  const toggleGoal = (goal: TrainingGoal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const updateClimbingLevel = (index: number, field: keyof ClimbingLevel, value: string) => {
    setFormData(prev => ({
      ...prev,
      climbingLevels: prev.climbingLevels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }));
  };

  const addClimbingLevel = () => {
    setFormData(prev => ({
      ...prev,
      climbingLevels: [...prev.climbingLevels, { discipline: 'bouldering', grade: '' }],
    }));
  };

  const removeClimbingLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      climbingLevels: prev.climbingLevels.filter((_, i) => i !== index),
    }));
  };

  const addLimitation = () => {
    if (newLimitation.description.trim()) {
      setFormData(prev => ({
        ...prev,
        limitations: [...prev.limitations, newLimitation],
      }));
      setNewLimitation({ type: 'other', description: '' });
    }
  };

  const removeLimitation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Info */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">👤</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us about yourself</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="experienceYears" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Years of Climbing Experience
            </label>
            <input
              type="number"
              id="experienceYears"
              required
              min="0"
              value={formData.experienceYears}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Climbing Levels */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">🏔️</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Climbing Level</h2>
            <p className="text-gray-600 dark:text-gray-400">What grades are you crushing?</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {formData.climbingLevels.map((level, index) => (
            <div key={index} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Discipline
                </label>
                <select
                  value={level.discipline}
                  onChange={(e) => updateClimbingLevel(index, 'discipline', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
                >
                  {DISCIPLINE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Grade
                </label>
                <input
                  type="text"
                  value={level.grade}
                  onChange={(e) => updateClimbingLevel(index, 'grade', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
                  placeholder="e.g., V4, 5.11a"
                  required
                />
              </div>

              {formData.climbingLevels.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeClimbingLevel(index)}
                  className="mt-8 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addClimbingLevel}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-bold flex items-center"
          >
            <span className="text-xl mr-2">+</span> Add Another Discipline
          </button>
        </div>
      </section>

      {/* Goals */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">🎯</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Training Goals</h2>
            <p className="text-gray-600 dark:text-gray-400">What do you want to achieve?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOAL_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.goals.includes(option.value)
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.goals.includes(option.value)}
                onChange={() => toggleGoal(option.value)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">🛠️</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Available Equipment</h2>
            <p className="text-gray-600 dark:text-gray-400">What gear do you have access to?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EQUIPMENT_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.availableEquipment.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.availableEquipment.includes(option.value)}
                onChange={() => toggleEquipment(option.value)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Weekly Availability */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">📅</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Weekly Availability</h2>
            <p className="text-gray-600 dark:text-gray-400">How much time can you dedicate?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="daysPerWeek" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Training Days Per Week
            </label>
            <input
              type="number"
              id="daysPerWeek"
              required
              min="1"
              max="7"
              value={formData.weeklyAvailability.daysPerWeek}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weeklyAvailability: {
                  ...prev.weeklyAvailability,
                  daysPerWeek: parseInt(e.target.value) || 1,
                }
              }))}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
            />
          </div>

          <div>
            <label htmlFor="minutesPerSession" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Minutes Per Session
            </label>
            <input
              type="number"
              id="minutesPerSession"
              required
              min="15"
              step="15"
              value={formData.weeklyAvailability.minutesPerSession}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weeklyAvailability: {
                  ...prev.weeklyAvailability,
                  minutesPerSession: parseInt(e.target.value) || 30,
                }
              }))}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="card-climbing p-8">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-4">⚠️</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Limitations (Optional)</h2>
            <p className="text-gray-600 dark:text-gray-400">Any injuries or constraints we should know about?</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {formData.limitations.map((limitation, index) => (
            <div key={index} className="flex gap-2 items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl">
              <span className="flex-1 text-gray-900 dark:text-white">
                <span className="font-bold capitalize">{limitation.type}:</span> {limitation.description}
              </span>
              <button
                type="button"
                onClick={() => removeLimitation(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <select
              value={newLimitation.type}
              onChange={(e) => setNewLimitation(prev => ({ ...prev, type: e.target.value as any }))}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
            >
              <option value="injury">Injury</option>
              <option value="time">Time Constraint</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={newLimitation.description}
              onChange={(e) => setNewLimitation(prev => ({ ...prev, description: e.target.value }))}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 transition-all"
              placeholder="Describe the limitation"
            />
            <button
              type="button"
              onClick={addLimitation}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl font-semibold transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="btn-climbing px-12 py-4 text-lg"
        >
          Save Profile & Continue →
        </button>
      </div>
    </form>
  );
}


