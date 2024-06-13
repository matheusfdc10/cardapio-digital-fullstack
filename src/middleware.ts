import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT_ADMIN,
    DEFAULT_LOGIN_REDIRECT_USER,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);


export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublickRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_USER, nextUrl))
        }
        return null;
    }

    if (!isLoggedIn && !isPublickRoute) {
        return Response.redirect(new URL("/", nextUrl))
    }

    
    return null;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}