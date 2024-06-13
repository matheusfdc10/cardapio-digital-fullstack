import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user?.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.password,
          )

          if (passwordMatch) return user;
        }

        return null;
      }
    })
  ],
  // trustHost: true
  // logger: {
  //   error(code, ...message) {
  //     console.error(code, message)
  //   },
  //   warn(code, ...message) {
  //     console.warn(code, message)
  //   },
  //   debug(code, ...message) {
  //     console.debug(code, message)
  //   },
  // },
} satisfies NextAuthConfig;