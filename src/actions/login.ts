"use server"

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT_ADMIN, DEFAULT_LOGIN_REDIRECT_USER } from "@/routes";
import { LoginSchema } from "@/schemas"
import { UserRole } from "@prisma/client";
import { AuthError } from "next-auth";
import { z } from "zod"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Campos inválidos"}
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        const redirect = user?.role === UserRole.ADMIN ? DEFAULT_LOGIN_REDIRECT_ADMIN : DEFAULT_LOGIN_REDIRECT_USER;
        
        await signIn("credentials", {
            email,
            password,
            redirect: !!user,
            redirectTo: redirect!,
        })

        return { success: "Logado!" }
    } catch(error) {
        if (error instanceof AuthError) {
            // console.log("EEERRRORRR", error.type)
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou senha inválidos" }
                default:
                    return { error: "Algo deu errado" }
            }
        }
        throw error;
    }
}