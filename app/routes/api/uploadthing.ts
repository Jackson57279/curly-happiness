/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await -- React Router type issues and uploadthing requirements */
import { getAuth } from "@clerk/react-router/ssr.server";
import { createUploadthing, type FileRouter } from "uploadthing/server";

// @ts-expect-error - Route namespace types not available
import type { Route } from "./+types/uploadthing";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ request }: Route.LoaderArgs) => {
      const { userId } = await getAuth(request);
      
      if (!userId) {
        throw new Error("Unauthorized");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ request }: Route.LoaderArgs) => {
      const { userId } = await getAuth(request);
      
      if (!userId) {
        throw new Error("Unauthorized");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
