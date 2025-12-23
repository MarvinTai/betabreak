import { NextRequest, NextResponse } from 'next/server';
import { getJob, cleanupOldJobs } from '../_jobStore';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Cleanup old jobs periodically
    cleanupOldJobs();

    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId query parameter' },
        { status: 400 }
      );
    }

    const job = getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found', jobId },
        { status: 404 }
      );
    }

    // Return job status
    const response: any = {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    if (job.status === 'done' && job.workouts) {
      response.workouts = job.workouts;
    }

    if (job.status === 'error') {
      response.error = job.error;
      // Only include stack trace in development
      if (process.env.NODE_ENV === 'development' && job.errorStack) {
        response.errorStack = job.errorStack;
      }
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error checking job status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check job status', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

