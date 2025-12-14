import { type FormEvent, useState } from 'react';
import { useNavigate } from "react-router";

import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { useUploadThing } from "~/lib/uploadthing";

const Upload = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { startUpload } = useUploadThing("resumeUploader");

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ 
        companyName, 
        jobTitle, 
        jobDescription, 
        file 
    }: { 
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        setIsProcessing(true);

        try {
            // Upload PDF resume
            setStatusText('Uploading the resume...');
            const resumeUpload = await startUpload([file]);
            if (!resumeUpload || resumeUpload.length === 0) {
                setStatusText('Error: Failed to upload resume');
                return;
            }
            const resumeUrl = resumeUpload[0].url;

            // Convert PDF to image
            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) {
                setStatusText('Error: Failed to convert PDF to image');
                return;
            }

            // Upload image
            setStatusText('Uploading the image...');
            const imageUpload = await startUpload([imageFile.file]);
            if (!imageUpload || imageUpload.length === 0) {
                setStatusText('Error: Failed to upload image');
                return;
            }
            const imageUrl = imageUpload[0].url;

            // Analyze resume with AI
            setStatusText('Analyzing resume with AI...');
            const analyzeResponse = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeUrl,
                    jobTitle,
                    jobDescription,
                }),
            });

            if (!analyzeResponse.ok) {
                setStatusText('Error: Failed to analyze resume');
                return;
            }

             
            const analyzeData = await analyzeResponse.json() as { feedback: ResumeFeedback };
             
            const { feedback } = analyzeData;

            // Save to database
            setStatusText('Saving results...');
            const saveResponse = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName,
                    jobTitle,
                    jobDescription,
                    resumeUrl,
                    imageUrl,
                     
                    feedback,
                }),
            });

            if (!saveResponse.ok) {
                setStatusText('Error: Failed to save resume');
                return;
            }

            const saveData = await saveResponse.json() as { resume: { id: string } };
            const { resume } = saveData;

            setStatusText('Analysis complete, redirecting...');
            void navigate(`/resume/${resume.id}`);
        } catch (error) {
            console.error('Error during analysis:', error);
            setStatusText('Error: Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        void handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit" disabled={!file || isProcessing}>
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upload
