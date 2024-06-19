import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Insira um E-mail válido"),
    password: z.string().min(1, "A senha deve conter no mínimo 6 caracteres")
})

export const RegisterSchema = z.object({
    name: z.string().min(3, "O nome deve conter no minímo 3 caracteres"),
    email: z.string().email("Insira um E-mail válido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação da senha deve conter no mínimo 6 caracteres"),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
})

export const DishSchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    description: z.string().optional(),
    status: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

export const DishCategorySchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    description: z.string().optional(),
    order: z.number(),
    status: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    dishes: z.array(DishSchema)
})