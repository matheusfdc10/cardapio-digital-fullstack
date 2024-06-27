import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(3, "O nome deve conter no minímo 3 caracteres"),
    email: z.string().email("Insira um E-mail válido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação da senha deve conter no mínimo 6 caracteres"),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
})