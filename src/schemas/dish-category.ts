import { z } from "zod";
import { DishSchema } from "./dish";

export const DishCategorySchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    // description: z.string().optional(),
    order: z.number().optional(),
    status: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // dishes: z.array(DishSchema)
})
