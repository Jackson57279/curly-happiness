import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

import { prepareInstructions } from '../../constants';

export async function analyzeResume({
  resumeUrl,
  jobTitle,
  jobDescription,
}: {
  resumeUrl: string;
  jobTitle: string;
  jobDescription: string;
}): Promise<Feedback | null> {
  try {
    const instructions = prepareInstructions({ jobTitle, jobDescription });

    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: instructions,
            },
            {
              type: 'file',
              data: resumeUrl,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    // Parse the JSON response
    const feedback = JSON.parse(text) as Feedback;
    return feedback;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return null;
  }
}
