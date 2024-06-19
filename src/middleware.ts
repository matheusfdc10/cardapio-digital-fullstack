import {
    DEFAULT_LOGIN_REDIRECT_ADMIN,
    DEFAULT_LOGIN_REDIRECT_USER,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
    privateRoutes
} from "@/routes";

import { UserRole } from "@prisma/client";

import { auth as middleware } from "@/auth"

export default middleware((req) => {
    const { nextUrl } = req;
    const auth = req.auth;
    const isLoggedIn = !!auth;
    const isAdmin = isLoggedIn && (auth.user.role == UserRole.ADMIN);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublickRoute = publicRoutes.includes(nextUrl.pathname);
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    
    if (isApiAuthRoute) {
        return
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            const redirectUrl = isAdmin ? DEFAULT_LOGIN_REDIRECT_ADMIN : DEFAULT_LOGIN_REDIRECT_USER;
            return Response.redirect(new URL(redirectUrl, nextUrl))
        }
    }

    if (!isLoggedIn && isPrivateRoute) {
        return Response.redirect(new URL("/", nextUrl))
    }
})


// export const config = {
//     matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
//     // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }