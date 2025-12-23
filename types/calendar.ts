import { Workout } from './index';

export interface ScheduledWorkout {
  id: string;
  workout: Workout;
  scheduledDate: string; // ISO date string
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  workout: Workout;
  scheduled: ScheduledWorkout;
}

export type CalendarView = 'week' | 'month';

