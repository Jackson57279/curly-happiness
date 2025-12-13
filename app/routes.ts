import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
    
    // API Routes
    route('/api/uploadthing', 'routes/api/uploadthing.ts'),
    route('/api/resumes', 'routes/api/resumes.ts'),
    route('/api/resume/:id', 'routes/api/resume.$id.ts'),
    route('/api/analyze', 'routes/api/analyze.ts'),
] satisfies RouteConfig;
