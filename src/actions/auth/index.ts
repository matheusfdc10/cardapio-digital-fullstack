"use server"

import { signIn, signOut } from "@/auth";
import { createUser, getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT_ADMIN, DEFAULT_LOGIN_REDIRECT_USER } from "@/routes";
import { LoginSchema, RegisterSchema } from "@/schemas"
import { UserRole } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Campos inválidos"}
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        const redirectPath = user?.role === UserRole.ADMIN ? DEFAULT_LOGIN_REDIRECT_ADMIN : DEFAULT_LOGIN_REDIRECT_USER;
        
        await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        redirect(redirectPath)

        // return { success: "Logado!" }
    } catch(error) {
        if (error instanceof AuthError) {
            console.log("EEERRRORRR", error.type)
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

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        
        if (!validatedFields.success) {
            return { error: "Campos inválidos" }
        }

        const {
            name,
            email,
            password,
        } = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "E-mail já cadastrado" };
        }

        const user = await createUser({
            name,
            email,
            password,
        })

        if (!user) {
            return { error: "Erro ao criar usuário, tente mais tarde" };
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        return { success: "Conta criada!" }
    } catch(error) {
        return { error: "Algo deu errado" }
    }
}

export const logout = async (redirectUrl?: string) => {
    try {
        await signOut({
            redirect: false
        })
        
        redirect(redirectUrl || '/')
    } catch(error) {
        throw error;
    }
}