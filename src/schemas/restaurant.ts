import { z } from "zod";

export const RestaurantSchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    logo: z.string().optional(),
    phone: z.string().min(10, "Mínimo 10 caracteres").max(11, "Máximo 11 caracteres"),
    whatsapp: z.string().min(10, "Mínimo 10 caracteres").max(11, "Máximo 11 caracteres"),
    email: z.string().email("Insira um E-mail válido"),
    minimumOrderValue: z.coerce.number().min(0.00, {
        message: "Valor mínimo 0,00"
    }).optional(),
    addressId: z.array(z.string()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})