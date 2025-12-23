'use client';

import { useState } from 'react';
import { ScheduledWorkout, CalendarView as ViewType } from '@/types/calendar';
import { Workout } from '@/types';

interface CalendarViewProps {
  scheduledWorkouts: ScheduledWorkout[];
  onReschedule: (scheduledId: string, newDate: Date) => void;
  onDelete: (scheduledId: string) => void;
  onComplete: (scheduledId: string) => void;
  onViewWorkout: (workout: Workout) => void;
}

export default function CalendarView({
  scheduledWorkouts,
  onReschedule,
  onDelete,
  onComplete,
  onViewWorkout,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');
  const [draggedWorkout, setDraggedWorkout] = useState<ScheduledWorkout | null>(null);

  // Helper functions
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday as first day
    return new Date(d.setDate(diff));
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const firstDayOfWeek = start.getDay();
    const totalDays = daysInMonth(currentDate);
    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  };

  const getWorkoutsForDate = (date: Date | null) => {
    if (!date) return [];
    
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return scheduledWorkouts.filter(sw => {
      const swDate = new Date(sw.scheduledDate);
      const swYear = swDate.getFullYear();
      const swMonth = String(swDate.getMonth() + 1).padStart(2, '0');
      const swDay = String(swDate.getDate()).padStart(2, '0');
      const swDateStr = `${swYear}-${swMonth}-${swDay}`;
      
      return swDateStr === dateStr;
    });
  };

  const handleDragStart = (sw: ScheduledWorkout) => {
    setDraggedWorkout(sw);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date | null, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWorkout && date) {
      onReschedule(draggedWorkout.id, date);
    }
    setDraggedWorkout(null);
  };

  const navigatePrevious = () => {
    if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderDayCell = (date: Date | null, index: number) => {
    if (!date) {
      return <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50 dark:bg-gray-900/30" />;
    }

    const workouts = getWorkoutsForDate(date);
    const today = isToday(date);

    return (
      <div
        key={date.toISOString()}
        className={`min-h-[120px] p-3 border-2 transition-all ${
          today
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        } ${draggedWorkout ? 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(date, e)}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-sm font-bold ${today ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {date.getDate()}
          </span>
          {workouts.length > 0 && (
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-bold">
              {workouts.length}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {workouts.map(sw => {
            // Safety check: ensure workout object exists
            if (!sw.workout) {
              console.warn('Invalid scheduled workout:', sw);
              return null;
            }
            
            return (
              <div
                key={sw.id}
                draggable
                onDragStart={() => handleDragStart(sw)}
                className={`p-2 rounded-lg cursor-move transition-all text-xs ${
                  sw.completed
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-700'
                    : 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-700'
                } hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${sw.completed ? 'line-through text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {sw.workout.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {sw.workout.estimatedDuration}min
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => onComplete(sw.id)}
                      className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
                      title={sw.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {sw.completed ? '↩️' : '✓'}
                    </button>
                    <button
                      onClick={() => onViewWorkout(sw.workout)}
                      className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
                      title="View details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onDelete(sw.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = view === 'week' ? getWeekDays() : getMonthDays();

  const getDateRangeText = () => {
    if (view === 'week') {
      const start = getWeekDays()[0];
      const end = getWeekDays()[6];
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="card-climbing p-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={navigatePrevious}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            onClick={navigateToday}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={navigateNext}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            →
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
            {getDateRangeText()}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 font-bold rounded-lg transition-all ${
              view === 'week'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 font-bold rounded-lg transition-all ${
              view === 'month'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`grid gap-2 ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
        {/* Day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-300 py-2">
            {day}
          </div>
        ))}

        {/* Day cells */}
        {days.map((date, index) => renderDayCell(date, index))}
      </div>

      {/* Drag hint */}
      {draggedWorkout && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-semibold text-center">
            🖱️ Drop workout on a day to reschedule
          </p>
        </div>
      )}
    </div>
  );
}

