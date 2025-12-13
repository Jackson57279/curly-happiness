import { getAuth } from '@clerk/react-router/ssr.server';
import { eq, and, desc } from 'drizzle-orm';
import { json } from 'react-router';

import { db } from '../../../db';
import { resumes } from '../../../db/schema';

import type { Route } from './+types/resumes';


// GET - Fetch all resumes for the authenticated user
export async function loader({ request }: Route.LoaderArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt));

    return json({ resumes: userResumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// POST - Create a new resume
export async function action({ request }: Route.ActionArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, jobTitle, jobDescription, resumeUrl, imageUrl, feedback } = body;

    const [newResume] = await db
      .insert(resumes)
      .values({
        userId,
        companyName,
        jobTitle,
        jobDescription,
        resumeUrl,
        imageUrl,
        feedback,
      })
      .returning();

    return json({ resume: newResume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
