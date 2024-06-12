"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import { createUser, getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";

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