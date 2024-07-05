import { z } from "zod";

export const OpeningHoursSchema = z.object({
    id: z.string(),
    dayOfWeek: z.number().min(0,'Selecione um dia da semana').max(6, 'Selecione um dia da semana'),
    opensAt: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horaio invalido'), 
    closesAt: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horaio invalido'),
    restaurantId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})