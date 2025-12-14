import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  companyName: text('company_name').notNull(),
  jobTitle: text('job_title').notNull(),
  jobDescription: text('job_description').notNull(),
  resumeUrl: text('resume_url').notNull(),
  imageUrl: text('image_url').notNull(),
  feedback: jsonb('feedback').$type<Feedback>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
