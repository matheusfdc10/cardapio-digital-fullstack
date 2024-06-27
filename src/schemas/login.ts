import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Insira um E-mail válido"),
    password: z.string().min(1, "A senha deve conter no mínimo 6 caracteres")
})
