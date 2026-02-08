import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute=createRouteMatcher(["/dashboard(.*)","/account(.*)","/transaction(.*)"])

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        shield({
            mode: "LIVE"
        }),
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"], // allow only these bots , GO HTTP is for inngest
        })
    ]
})

const clerk=clerkMiddleware(async(auth,req)=>{
    const{userId}=await auth() // returns null or id based on authentication

    // if the user hasnt logged in but tried to access any routes of isProtectedRoute , 
    // then redirect them back to signin 
    if(!userId && isProtectedRoute(req)){ 
        const { redirectToSignIn} = await auth()
        return redirectToSignIn()
    }
});

export default createMiddleware(aj,clerk) // first check for bots then the users

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

// dashboard(.*) it means whatever comes after it , like an regex