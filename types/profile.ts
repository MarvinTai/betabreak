// Climbing levels and grades
export type ClimbingDiscipline = 'bouldering' | 'sport' | 'trad' | 'mixed';

export interface ClimbingLevel {
  discipline: ClimbingDiscipline;
  grade: string; // e.g., "V4", "5.11a", etc.
}

// Equipment available to the user
export type Equipment = 
  | 'hangboard'
  | 'campus_board'
  | 'systems_wall'
  | 'resistance_bands'
  | 'weights'
  | 'pull_up_bar'
  | 'rings'
  | 'none';

// Training goals
export type TrainingGoal = 
  | 'increase_grade'
  | 'build_endurance'
  | 'prevent_injury'
  | 'improve_technique'
  | 'competition_prep'
  | 'general_fitness';

// Limitations or injuries
export interface Limitation {
  type: 'injury' | 'time' | 'other';
  description: string;
}

// Complete user profile
export interface UserProfile {
  id?: string;
  name: string;
  climbingLevels: ClimbingLevel[];
  goals: TrainingGoal[];
  availableEquipment: Equipment[];
  weeklyAvailability: {
    daysPerWeek: number;
    minutesPerSession: number;
  };
  limitations: Limitation[];
  experienceYears: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form state for the profile setup
export type ProfileFormData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;


