import { getAuth } from '@clerk/react-router/ssr.server';
import { json } from 'react-router';

import type { Route } from './+types/analyze';

import { analyzeResume } from '~/lib/ai';

// POST - Analyze a resume using AI
export async function action({ request }: Route.ActionArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeUrl, jobTitle, jobDescription } = body;

    if (!resumeUrl || !jobTitle || !jobDescription) {
      return json(
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
      return json({ error: 'Failed to analyze resume' }, { status: 500 });
    }

    return json({ feedback });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
