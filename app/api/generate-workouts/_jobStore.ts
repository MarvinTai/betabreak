import { Workout } from '@/types';

export interface JobRecord {
  jobId: string;
  status: 'running' | 'done' | 'error';
  createdAt: Date;
  updatedAt: Date;
  progress?: string;
  error?: string;
  errorStack?: string;
  workouts?: Workout[];
}

// In-memory job store
// NOTE: In production, use Redis or a database for multi-instance deployments
declare global {
  var workoutJobs: Map<string, JobRecord> | undefined;
}

if (!globalThis.workoutJobs) {
  globalThis.workoutJobs = new Map<string, JobRecord>();
}

export const jobStore = globalThis.workoutJobs;

// TTL for job cleanup (30 minutes)
const JOB_TTL_MS = 30 * 60 * 1000;

export function cleanupOldJobs() {
  const now = new Date();
  const keysToDelete: string[] = [];
  
  jobStore.forEach((job, jobId) => {
    const age = now.getTime() - job.updatedAt.getTime();
    if (age > JOB_TTL_MS) {
      keysToDelete.push(jobId);
    }
  });
  
  keysToDelete.forEach(jobId => {
    console.log(`Cleaning up old job: ${jobId}`);
    jobStore.delete(jobId);
  });
  
  if (keysToDelete.length > 0) {
    console.log(`Cleaned up ${keysToDelete.length} old job(s)`);
  }
}

export function createJob(jobId: string): JobRecord {
  const job: JobRecord = {
    jobId,
    status: 'running',
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: 'Initializing workout generation...',
  };
  jobStore.set(jobId, job);
  return job;
}

export function updateJob(jobId: string, updates: Partial<JobRecord>): JobRecord | null {
  const job = jobStore.get(jobId);
  if (!job) return null;
  
  const updatedJob = {
    ...job,
    ...updates,
    updatedAt: new Date(),
  };
  jobStore.set(jobId, updatedJob);
  return updatedJob;
}

export function getJob(jobId: string): JobRecord | null {
  return jobStore.get(jobId) || null;
}

