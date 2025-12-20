// Training focus areas
export type TrainingFocus = 
  | 'finger_strength'
  | 'power'
  | 'endurance'
  | 'technique'
  | 'flexibility'
  | 'core_strength'
  | 'antagonist_training';

// Workout structure
export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string; // e.g., "30 seconds", "5 minutes"
  rest?: string;
  instructions: string;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  focus: TrainingFocus[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  warmup?: Exercise[];
  cooldown?: Exercise[];
  notes?: string;
  createdAt: Date;
}

// Training session (scheduled or completed)
export interface TrainingSession {
  id: string;
  workoutId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'skipped';
  completedAt?: Date;
  userNotes?: string;
  workout: Workout;
}

// Training program
export interface TrainingProgram {
  id: string;
  userId: string;
  name: string;
  focus: TrainingFocus[];
  sessions: TrainingSession[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}


