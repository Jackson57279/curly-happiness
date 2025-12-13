import { getAuth } from '@clerk/react-router/ssr.server';
import { eq, and } from 'drizzle-orm';
import { Link, useLoaderData } from "react-router";

import { db } from '../../db';
import { resumes } from '../../db/schema';

import type { Route } from './+types/resume';

import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

export async function loader({ request, params }: Route.LoaderArgs) {
    const { userId } = await getAuth(request);

    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const [resume] = await db
        .select()
        .from(resumes)
        .where(and(eq(resumes.id, params.id), eq(resumes.userId, userId)))
        .limit(1);

    if (!resume) {
        throw new Response("Resume not found", { status: 404 });
    }

    return { resume };
}

const Resume = () => {
    const { resume } = useLoaderData<typeof loader>();

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {resume.imageUrl && resume.resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resume.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={resume.imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                    alt="Resume preview"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {resume.feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={resume.feedback} />
                            <ATS score={resume.feedback.ATS.score || 0} suggestions={resume.feedback.ATS.tips || []} />
                            <Details feedback={resume.feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume
