"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RestaurantSchema } from "@/schemas/restaurant";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const RestaurantUpdate = RestaurantSchema.extend({
}).omit({ createdAt: true, updatedAt: true, addressId: true,  })


const RestaurantCreate = RestaurantSchema.extend({
}).omit({ id: true, createdAt: true, updatedAt: true, addressId: true })


export const getRestaurant = async () => {
    try {
        const restaurant = await db.restaurant.findMany({
            include: {
                address: true,
            }
        })

        return { 
            data: restaurant.length ? restaurant[0] : null,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado',
        }
    }
}

export const createRestaurant = async (data: z.infer<typeof RestaurantCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const hasRestaurant = await getRestaurant();

        if (hasRestaurant.data) {
            return {
                data: null,
                error: "Restaurante já cadastrado"
            }
        }

        const validatedFields = RestaurantCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const restaurant = await db.restaurant.create({
            data: {
                name: data.name,
                logo: data.logo,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                minimumOrderValue: data.minimumOrderValue
            }
        })
        
        return {
            data: restaurant,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateRestaurant = async(data: z.infer<typeof RestaurantUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = RestaurantUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const restaurant = await db.restaurant.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!restaurant) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateRestaurant = await db.restaurant.update({
            where: {
                id: restaurant.id,
            },
            data: {
                name: data.name,
                logo: data.logo,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                minimumOrderValue: data.minimumOrderValue
            }
        })

        return {
            data: updateRestaurant,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}