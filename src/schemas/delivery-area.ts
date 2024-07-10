import { z } from "zod";

export const DeliveryAreaSchema = z.object({
    id: z.string(),
    range: z.coerce.number().min(0.01, {
        message: "Valor mínimo 0.5 km"
    }),
    fee: z.coerce.number().min(0.00, {
        message: "Valor mínimo 0.00"
    }),
    time: z.coerce.number().min(1, {
        message: "Mínimo 1 minuto"
    }).int('Digite em minutos'),
    restaurantId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})