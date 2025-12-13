import { getAuth } from "@clerk/react-router/ssr.server";
import { eq, desc } from "drizzle-orm";
import { Link, useLoaderData } from "react-router";

import { db } from "../../db";
import { resumes } from "../../db/schema";

import type { Route } from "./+types/home";

import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const userResumes = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt));

  return { resumes: userResumes };
}

export default function Home() {
  const { resumes: userResumes } = useLoaderData<typeof loader>();

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {userResumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {userResumes.length > 0 && (
          <div className="resumes-section">
            {userResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {userResumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
