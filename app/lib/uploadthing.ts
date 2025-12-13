import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "~/routes/api/uploadthing";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
