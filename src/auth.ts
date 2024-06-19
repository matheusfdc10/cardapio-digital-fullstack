import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db";
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";
import { UserRole } from "@prisma/client";


export const { 
    handlers,
    auth,
    signIn,
    signOut,
    unstable_update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        // async authorized({ auth, request: { nextUrl }}) {
        //     const user = auth?.user.role;
        //     const isLoggedIn = !!user;
        //     const isAuthRoutes = nextUrl.pathname.startsWith("/auth");
        //     if (isLoggedIn && isAuthRoutes) {
        //         return Response.redirect(new URL("/", nextUrl))
        //     }
        //     return true
        // },
        // async signIn({ account, user }) {
        //     if (account?.provider !== "credentials") return true;
      
        //     if (!user.id) return false;
      
        //     const existingUser = await getUserById(user.id)


        //     return true
        //     if(!existingUser) return false;
      
        //     return true;
        // },
        async session({ session, token, user, newSession, trigger }) {
            if(session.user && token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }

            return session;
        },
        async jwt({ token, user}) {
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token = {
                ...token,
                ...existingUser
                // role: existingUser.role
            }
            delete token.password;
            
            return token;
        },
    },
    // trustHost: true,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    // debug: true,
    ...authConfig,
})