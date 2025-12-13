m
i # Migration Guide: Puter.js → Modern Stack

This guide explains the migration from Puter.js to a modern backend stack.

## New Stack

- **Authentication**: Clerk
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **File Storage**: UploadThing
- **AI**: Vercel AI SDK with Google Gemini
- **Backend**: React Router v7 API Routes

## Setup Instructions

### 1. Install Dependencies

Dependencies have already been installed. If you need to reinstall:

```bash
bun install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Neon Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# UploadThing
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=xxxxx

# App URL
VITE_APP_URL=http://localhost:5173
```

### 3. Get API Keys

#### Clerk (Authentication)
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys
4. Add them to your `.env` file

#### Neon (Database)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file as `DATABASE_URL`

#### UploadThing (File Storage)
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy the secret and app ID
4. Add them to your `.env` file

#### Google AI (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file

### 4. Database Setup

Generate and push the database schema:

```bash
# Generate migration files
bun run db:generate

# Push schema to database
bun run db:push
```

### 5. Run Drizzle Studio (Optional)

To view and manage your database:

```bash
bun run db:studio
```

This will open Drizzle Studio at `https://local.drizzle.studio`

### 6. Start Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

## What Changed

### Removed
- `app/lib/puter.ts` - Puter.js store and utilities
- Puter.js script tag from `app/root.tsx`
- `zustand` dependency (no longer needed)

### Added
- `db/schema.ts` - Database schema definition
- `db/index.ts` - Database connection
- `app/lib/uploadthing.ts` - UploadThing utilities
- `app/lib/ai.ts` - AI analysis utilities
- `app/routes/api/` - API route handlers
  - `uploadthing.ts` - File upload endpoint
  - `resumes.ts` - Resume CRUD operations
  - `resume.$id.ts` - Single resume operations
  - `analyze.ts` - AI analysis endpoint

### Modified
- `app/root.tsx` - Added ClerkProvider
- `app/routes/auth.tsx` - Uses Clerk components
- `app/routes/home.tsx` - Fetches from database
- `app/routes/upload.tsx` - Uses UploadThing and new API
- `app/routes/resume.tsx` - Fetches from database
- `app/components/Navbar.tsx` - Added Clerk UserButton
- `package.json` - Added database scripts

## Architecture

### Authentication Flow
1. User visits `/auth`
2. Clerk handles sign-in/sign-up
3. User is redirected to home page
4. All routes check authentication via Clerk

### File Upload Flow
1. User selects PDF resume
2. File is uploaded to UploadThing
3. PDF is converted to image
4. Image is uploaded to UploadThing
5. URLs are stored in database

### AI Analysis Flow
1. Resume URL is sent to `/api/analyze`
2. Gemini analyzes the resume
3. Feedback is returned as JSON
4. Feedback is stored in database

### Database Schema
```typescript
resumes {
  id: uuid (primary key)
  userId: text (Clerk user ID)
  companyName: text
  jobTitle: text
  jobDescription: text
  resumeUrl: text (UploadThing URL)
  imageUrl: text (UploadThing URL)
  feedback: jsonb (AI analysis)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Troubleshooting

### TypeScript Errors
The TypeScript errors you see are expected during development. They will resolve once:
1. You run `npm install` to ensure all packages are properly installed
2. The React Router type generation runs (`npm run typecheck`)

### Database Connection Issues
- Ensure your `DATABASE_URL` is correct
- Check that your Neon project is active
- Verify SSL mode is set to `require`

### UploadThing Issues
- Verify your API keys are correct
- Check that your app is properly configured
- Ensure file size limits are appropriate

### Clerk Issues
- Verify your publishable and secret keys
- Check that your application is properly configured
- Ensure redirect URLs are set correctly

## Next Steps

1. Set up all environment variables
2. Run database migrations
3. Test the authentication flow
4. Test file upload
5. Test AI analysis
6. Deploy to production

## Production Deployment

When deploying to production:
1. Set all environment variables in your hosting platform
2. Run `bun run build`
3. Deploy the `build` directory
4. Ensure your database is accessible from production
5. Update Clerk redirect URLs for production domain
