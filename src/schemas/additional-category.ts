import { z } from "zod";

export const AdditionalCategorySchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    description: z.string().optional(),
    order: z.number().optional(),
    status: z.boolean(),
    isRequired: z.boolean(),
    maxItems: z.coerce.number().int({
        message: 'Somente numeros inteiros'
    }).default(0),
    additionalIds: z.string().array(),
    dishIds: z.string().array(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})