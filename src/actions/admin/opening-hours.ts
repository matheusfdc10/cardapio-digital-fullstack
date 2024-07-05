"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OpeningHoursSchema } from "@/schemas/opening-hours";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { getRestaurant } from "@/actions/admin/restaurant";

const OpeningHoursUpdate = OpeningHoursSchema
.extend({
})
.omit({ createdAt: true, updatedAt: true, restaurantId: true })
.refine((data) => {
    const [opensHour, opensMinute] = data.opensAt.split(":").map(Number);
    const [closesHour, closesMinute] = data.closesAt.split(":").map(Number);

    const opensAtMinutes = opensHour * 60 + opensMinute;
    const closesAtMinutes = closesHour * 60 + closesMinute;

    return opensAtMinutes < closesAtMinutes;
}, {
    message: "O horário de abertura deve ser anterior ao horário de fechamento",
    path: ["opensAt", "closesAt"],
});

const OpeningHoursCreate = OpeningHoursSchema
.extend({
})
.omit({ id: true, createdAt: true, updatedAt: true, restaurantId: true })
.refine((data) => {
    const [opensHour, opensMinute] = data.opensAt.split(":").map(Number);
    const [closesHour, closesMinute] = data.closesAt.split(":").map(Number);

    const opensAtMinutes = opensHour * 60 + opensMinute;
    const closesAtMinutes = closesHour * 60 + closesMinute;

    return opensAtMinutes < closesAtMinutes;
}, {
    message: "O horário de abertura deve ser anterior ao horário de fechamento",
    path: ["opensAt", "closesAt"],
});


export const getOpeningHoursAll = async () => {
    try {
        const openingHoursAll = await db.openingHours.findMany({
            orderBy: {
                dayOfWeek: 'asc'
            }
        })

        return { 
            data: openingHoursAll,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getgetOpeningHoursId = async (id: string) => {
    try {
        const openingHours = await db.openingHours.findUnique({
            where: {
                id: id
            }
        })

        if (!openingHours) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: openingHours,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createOpeningHours = async (data: z.infer<typeof OpeningHoursCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = OpeningHoursCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const restaurant = await getRestaurant();

        if (!restaurant.data) {
            return {
                data: null,
                error: "Loja não criada"
            }
        }

        const openingHours = await db.openingHours.create({
            data: {
                restaurantId: restaurant.data.id,
                dayOfWeek: data.dayOfWeek,
                opensAt: data.opensAt,
                closesAt: data.closesAt,
            }
        })

        return {
            data: openingHours,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateOpeningHours = async (data: z.infer<typeof OpeningHoursUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = OpeningHoursUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const openingHours = await db.openingHours.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!openingHours) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateOpeningHours = await db.openingHours.update({
            where: {
                id: openingHours.id,
            },
            data: {
                // restaurantId: restaurant.data.id,
                dayOfWeek: data.dayOfWeek,
                opensAt: data.opensAt,
                closesAt: data.closesAt,
            }
        })

        return {
            data: updateOpeningHours,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const deleteOpeningHours = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const openingHours = await db.openingHours.findUnique({
            where: {
                id
            }
        })

        const deleteOpeningHours = await db.openingHours.delete({
            where: {
                id: id,
            },
        });

        return {
            data: openingHours,
            success: 'Deletado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}
