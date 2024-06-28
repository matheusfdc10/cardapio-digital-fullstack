import { z } from "zod";

export const AdditionalSchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    price: z.coerce.number().min(0.00, {
        message: "Valor mínimo 0,00"
    }),
    status: z.boolean(),
    categoryIds: z.string().array(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})