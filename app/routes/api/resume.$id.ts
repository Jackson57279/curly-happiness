/* eslint-disable @typescript-eslint/no-unsafe-argument -- React Router type issues with error types */
import { getAuth } from '@clerk/react-router/ssr.server';
import { eq, and } from 'drizzle-orm';
import { data } from 'react-router';

import { db } from '../../../db';
import { resumes } from '../../../db/schema';

// import type { Route } from './types/resume.$id';


// GET - Fetch a single resume by ID
export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  // @ts-expect-error - getAuth type incompatibility with Request type
  const { userId } = await getAuth(request);

  if (!userId) {
    return data({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, params.id), eq(resumes.userId, userId)))
      .limit(1);

    if (!resume) {
      return data({ error: 'Resume not found' }, { status: 404 });
    }

    return data({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return data({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

// DELETE - Delete a resume
export async function action({ request, params }: { request: Request; params: { id: string } }) {
  // @ts-expect-error - getAuth type incompatibility with Request type
  const { userId } = await getAuth(request);

  if (!userId) {
    return data({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method !== 'DELETE') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    await db
      .delete(resumes)
      .where(and(eq(resumes.id, params.id), eq(resumes.userId, userId)));

    return data({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return data({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
