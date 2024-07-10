"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DeliveryAreaSchema } from "@/schemas/delivery-area";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { getRestaurant } from "@/actions/admin/restaurant";

const DeliveryAreaUpdate = DeliveryAreaSchema
.extend({
    
})
.omit({ createdAt: true, updatedAt: true, restaurantId: true })

const DeliveryAreaCreate = DeliveryAreaSchema
.extend({

})
.omit({ id: true, createdAt: true, updatedAt: true, restaurantId: true,  })


export const getDeliveryAreas = async () => {
    try {
        const deliveryArea = await db.deliveryArea.findMany({
            orderBy: {
                range: 'asc'
            },
        })

        return { 
            data: deliveryArea,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getDeliveryAreaId = async (id: string) => {
    try {
        const deliveryArea = await db.deliveryArea.findUnique({
            where: {
                id: id
            }
        })

        if (!deliveryArea) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: deliveryArea,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createDeliveryArea = async (data: z.infer<typeof DeliveryAreaCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DeliveryAreaCreate.safeParse(data);

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

        const deliveryArea = await db.deliveryArea.create({
            data: {
                restaurantId: restaurant.data.id,
                fee: data.fee,
                range: data.range,
                time: data.time,
            }
        })

        return {
            data: deliveryArea,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateDeliveryArea = async (data: z.infer<typeof DeliveryAreaUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DeliveryAreaUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const deliveryArea = await db.deliveryArea.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!deliveryArea) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateDeliveryArea = await db.deliveryArea.update({
            where: {
                id: deliveryArea.id,
            },
            data: {
                // restaurantId: restaurant.data.id,
                fee: data.fee,
                range: data.range,
                time: data.time,
            }
        })

        return {
            data: updateDeliveryArea,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const deleteDeliveryArea = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const deliveryArea = await db.deliveryArea.findUnique({
            where: {
                id
            }
        })

        if (!deliveryArea) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const deleteDeliveryArea = await db.deliveryArea.delete({
            where: {
                id: id,
            },
        });

        return {
            data: deleteDeliveryArea,
            success: 'Deletado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}
