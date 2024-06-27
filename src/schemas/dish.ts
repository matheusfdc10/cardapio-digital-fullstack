import { z } from "zod";
import { DishCategorySchema } from "./dish-category";

export const DishSchema = z.object({
    id: z.string(),
    name: z
        .string({ required_error: 'O nome é obrigatório'})
        .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    description: z.string().optional(),
    price: z.coerce.number().min(0.00, {
        message: "Valor mínimo 0,00"
    }),
    image: z.string().optional(),
    status: z.boolean().default(false),
    categoryId: z.string().min(1, {
        message: "Selecione uma categoria"
    }),
    additionalCategoryIds: z.string().array(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // category: z.array(DishCategorySchema)
})