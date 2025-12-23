import { supabase } from './client';
import { UserProfile, Workout } from '@/types';
import { ScheduledWorkout } from '@/types/calendar';

// ==================== PROFILES ====================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error
    throw error;
  }

  return data;
}

export async function createProfile(userId: string, profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
  console.log('Creating profile for user:', userId);
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      name: profile.name,
      experience_years: profile.experienceYears,
      climbing_levels: profile.climbingLevels,
      goals: profile.goals,
      available_equipment: profile.availableEquipment,
      weekly_availability: profile.weeklyAvailability,
      limitations: profile.limitations,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message || 'Failed to create profile');
  }
  
  return data;
}

export async function updateProfile(userId: string, profile: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) {
  const updateData: any = {};
  
  if (profile.name) updateData.name = profile.name;
  if (profile.experienceYears !== undefined) updateData.experience_years = profile.experienceYears;
  if (profile.climbingLevels) updateData.climbing_levels = profile.climbingLevels;
  if (profile.goals) updateData.goals = profile.goals;
  if (profile.availableEquipment) updateData.available_equipment = profile.availableEquipment;
  if (profile.weeklyAvailability) updateData.weekly_availability = profile.weeklyAvailability;
  if (profile.limitations) updateData.limitations = profile.limitations;

  console.log('Updating profile for user:', userId, 'with data:', updateData);

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
  
  return data;
}

// ==================== WORKOUTS ====================

export async function getWorkouts(userId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform database format to app format
  return data.map(row => ({
    id: row.id,
    title: row.title,
    focus: row.focus,
    estimatedDuration: row.estimated_duration,
    difficulty: row.difficulty,
    exercises: row.exercises,
    warmup: row.warmup,
    cooldown: row.cooldown,
    notes: row.notes,
    createdAt: new Date(row.created_at),
  })) as Workout[];
}

export async function createWorkout(userId: string, workout: Omit<Workout, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      title: workout.title,
      focus: workout.focus,
      estimated_duration: workout.estimatedDuration,
      difficulty: workout.difficulty,
      exercises: workout.exercises,
      warmup: workout.warmup,
      cooldown: workout.cooldown,
      notes: workout.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createWorkouts(userId: string, workouts: Omit<Workout, 'id' | 'createdAt'>[]) {
  const { data, error } = await supabase
    .from('workouts')
    .insert(
      workouts.map(workout => ({
        user_id: userId,
        title: workout.title,
        focus: workout.focus,
        estimated_duration: workout.estimatedDuration,
        difficulty: workout.difficulty,
        exercises: workout.exercises,
        warmup: workout.warmup,
        cooldown: workout.cooldown,
        notes: workout.notes,
      }))
    )
    .select();

  if (error) throw error;
  return data;
}

export async function deleteWorkout(userId: string, workoutId: string) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('user_id', userId)
    .eq('id', workoutId);

  if (error) throw error;
}

// ==================== SCHEDULED WORKOUTS ====================

export async function getScheduledWorkouts(userId: string, startDate?: Date, endDate?: Date) {
  let query = supabase
    .from('scheduled_workouts')
    .select(`
      *,
      workouts (*)
    `)
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true });

  if (startDate) {
    query = query.gte('scheduled_date', startDate.toISOString().split('T')[0]);
  }
  if (endDate) {
    query = query.lte('scheduled_date', endDate.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Transform to app format
  return data.map(row => ({
    id: row.id,
    workout: {
      id: row.workouts.id,
      title: row.workouts.title,
      focus: row.workouts.focus,
      estimatedDuration: row.workouts.estimated_duration,
      difficulty: row.workouts.difficulty,
      exercises: row.workouts.exercises,
      warmup: row.workouts.warmup,
      cooldown: row.workouts.cooldown,
      notes: row.workouts.notes,
      createdAt: new Date(row.workouts.created_at),
    },
    scheduledDate: row.scheduled_date,
    completed: row.completed,
    completedAt: row.completed_at ? row.completed_at : undefined,
    notes: row.notes,
  })) as ScheduledWorkout[];
}

export async function scheduleWorkout(userId: string, workoutId: string, date: Date, notes?: string) {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      scheduled_date: date.toISOString().split('T')[0],
      notes,
    })
    .select(`
      *,
      workouts (*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function rescheduleWorkout(userId: string, scheduledWorkoutId: string, newDate: Date) {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .update({
      scheduled_date: newDate.toISOString().split('T')[0],
    })
    .eq('user_id', userId)
    .eq('id', scheduledWorkoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeWorkout(userId: string, scheduledWorkoutId: string, completed: boolean) {
  const { data, error } = await supabase
    .from('scheduled_workouts')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('user_id', userId)
    .eq('id', scheduledWorkoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScheduledWorkout(userId: string, scheduledWorkoutId: string) {
  const { error } = await supabase
    .from('scheduled_workouts')
    .delete()
    .eq('user_id', userId)
    .eq('id', scheduledWorkoutId);

  if (error) throw error;
}

