import { getAuth } from '@clerk/react-router/ssr.server';
import { eq, and } from 'drizzle-orm';
import { json } from 'react-router';

import { db } from '../../../db';
import { resumes } from '../../../db/schema';

import type { Route } from './types/resume.$id';


// GET - Fetch a single resume by ID
export async function loader({ request, params }: Route.LoaderArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, params.id), eq(resumes.userId, userId)))
      .limit(1);

    if (!resume) {
      return json({ error: 'Resume not found' }, { status: 404 });
    }

    return json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

// DELETE - Delete a resume
export async function action({ request, params }: Route.ActionArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    await db
      .delete(resumes)
      .where(and(eq(resumes.id, params.id), eq(resumes.userId, userId)));

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
