// Utility functions for localStorage management
import { UserProfile, Workout, TrainingSession } from '@/types';

// Profile Management
export function saveProfile(profile: UserProfile): void {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem('userProfile');
  return data ? JSON.parse(data) : null;
}

export function deleteProfile(): void {
  localStorage.removeItem('userProfile');
}

// Workout Management
export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));
}

export function getWorkouts(): Workout[] {
  const data = localStorage.getItem('workouts');
  return data ? JSON.parse(data) : [];
}

export function getWorkoutById(id: string): Workout | null {
  const workouts = getWorkouts();
  return workouts.find(w => w.id === id) || null;
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts().filter(w => w.id !== id);
  localStorage.setItem('workouts', JSON.stringify(workouts));
}

// Training Session Management
export function saveTrainingSession(session: TrainingSession): void {
  const sessions = getTrainingSessions();
  sessions.push(session);
  localStorage.setItem('trainingSessions', JSON.stringify(sessions));
}

export function getTrainingSessions(): TrainingSession[] {
  const data = localStorage.getItem('trainingSessions');
  return data ? JSON.parse(data) : [];
}

export function updateTrainingSession(id: string, updates: Partial<TrainingSession>): void {
  const sessions = getTrainingSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    localStorage.setItem('trainingSessions', JSON.stringify(sessions));
  }
}

export function deleteTrainingSession(id: string): void {
  const sessions = getTrainingSessions().filter(s => s.id !== id);
  localStorage.setItem('trainingSessions', JSON.stringify(sessions));
}

// Training Focus Management
export function saveTrainingFocus(focus: any): void {
  localStorage.setItem('trainingFocus', JSON.stringify(focus));
}

export function getTrainingFocus(): any | null {
  const data = localStorage.getItem('trainingFocus');
  return data ? JSON.parse(data) : null;
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem('userProfile');
  localStorage.removeItem('workouts');
  localStorage.removeItem('trainingSessions');
  localStorage.removeItem('trainingFocus');
}


