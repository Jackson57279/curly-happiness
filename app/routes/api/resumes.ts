/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument -- React Router type issues with error types */
import { getAuth } from '@clerk/react-router/ssr.server';
import { eq, desc } from 'drizzle-orm';
import { data } from 'react-router';

import { db } from '../../../db';
import { resumes } from '../../../db/schema';

// import type { Route } from './+types/resumes';


// GET - Fetch all resumes for the authenticated user
export async function loader({ request }: { request: Request }) {
  // @ts-expect-error - getAuth type incompatibility with Request type
  const { userId } = await getAuth(request);

  if (!userId) {
    return data({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt));

    return data({ resumes: userResumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return data({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// POST - Create a new resume
export async function action({ request }: { request: Request }) {
  // @ts-expect-error - getAuth type incompatibility with Request type
  const { userId } = await getAuth(request);

  if (!userId) {
    return data({ error: 'Unauthorized' }, { status: 401 });
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

    return data({ resume: newResume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return data({ error: 'Failed to create resume' }, { status: 500 });
  }
}
