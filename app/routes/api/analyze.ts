/* eslint-disable @typescript-eslint/no-unsafe-assignment -- React Router type issues with error types */
import { getAuth } from '@clerk/react-router/ssr.server';
import { data } from 'react-router';

// import type { Route } from './+types/analyze';

import { analyzeResume } from '~/lib/ai';

// POST - Analyze a resume using AI
export async function action({ request }: { request: Request }) {
  // @ts-expect-error - getAuth type incompatibility with Request type
  const { userId } = await getAuth(request);

  if (!userId) {
    return data({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeUrl, jobTitle, jobDescription } = body;

    if (!resumeUrl || !jobTitle || !jobDescription) {
      return data(
        { error: 'Missing required fields: resumeUrl, jobTitle, jobDescription' },
        { status: 400 }
      );
    }

    const feedback = await analyzeResume({
      resumeUrl,
      jobTitle,
      jobDescription,
    });

    if (!feedback) {
      return data({ error: 'Failed to analyze resume' }, { status: 500 });
    }

    return data({ feedback });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return data({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
