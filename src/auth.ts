import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config"
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export const { 
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider !== "credentials") return true;
      
            if (!user.id) return false;
      
            const existingUser = await getUserById(user.id)

            if(!existingUser) return false;
      
            return true;
        },
        async session({ session, token }: any) {
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

            token.role = existingUser.role;

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    // debug: true,
    ...authConfig,
})