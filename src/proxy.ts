import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/signin(.*)', 
  '/auth(.*)', 
  '/docs(.*)', 
  '/status(.*)',
  '/models(.*)',
  '/api(.*)',
  '/admin(.*)', 
  '/team(.*)', 
  '/oauth(.*)',
  '/#pricing'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|riv)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
