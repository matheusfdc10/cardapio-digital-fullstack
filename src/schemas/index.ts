import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email inválido"
    }),
    password: z.string().min(1, {
        message: "Senha inválida"
    })
})

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Nome inválido"
    }),
    email: z.string().email({
        message: "Email inválido"
    }),
    password: z.string().min(6, {
        message: "São necessários no mínimo 6 caracteres"
    }),
    confirmPassword: z.string().min(6, {
        message: "São necessários no mínimo 6 caracteres"
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
})