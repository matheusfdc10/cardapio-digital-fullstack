"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AddressSchema, } from "@/schemas/address";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { getRestaurant } from "@/actions/admin/restaurant";

const AddressUpdate = AddressSchema.extend({
    streetAddress: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
}).omit({ createdAt: true, updatedAt: true, userId: true })


const AddressCreate = AddressSchema.extend({
}).omit({ id: true, createdAt: true, updatedAt: true, userId: true })


export const getAddress = async () => {
    try {
        const restaurant = await getRestaurant();

        if (restaurant.success && restaurant.data === null) {
            return {
                data: null,
                error: 'Cadastre sua loja primeiro',
            }
        }

        return { 
            data: restaurant.data?.address || null,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado',
        }
    }
}

export const createAddress = async (data: z.infer<typeof AddressCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AddressCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const restaurant = await getRestaurant();

        if (restaurant.success && restaurant.data === null) {
            return {
                data: null,
                error: 'Cadastre sua loja primeiro',
            }
        }

        const address = await db.address.create({
            data: {
                city: data.city,
                state: data.state,
                streetAddress: data.streetAddress,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                zipCode: data.zipCode,
                country: data.country,
                latitude: data.latitude,
                longitude: data.longitude,
                restaurant: {
                    connect: {
                        id: restaurant.data?.id
                    }
                }
            }
        })
        
        return {
            data: address,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateAddress = async(data: z.infer<typeof AddressUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AddressUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const address = await db.address.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!address) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateAddress = await db.address.update({
            where: {
                id: address.id,
            },
            data: {
                city: data.city,
                state: data.state,
                streetAddress: data.streetAddress,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                zipCode: data.zipCode,
                country: data.country,
                latitude: data.latitude,
                longitude: data.longitude,
            }
        })

        return {
            data: updateAddress,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}