"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdditionalSchema } from "@/schemas/additional";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const AdditionalUpdate = AdditionalSchema.extend({
    name: z.string().optional(),
    status: z.boolean().optional(),
    price: z.coerce.number().min(0.00).optional(),
    categoryIds: z.string().array().optional(),
}).omit({ createdAt: true, updatedAt: true })

const AdditionalCreate = AdditionalSchema.extend({
    status: z.boolean().optional()
}).omit({ id: true, createdAt: true, order: true, updatedAt: true, })


export const getAdditionals = async () => {
    try {
        const additionals = await db.additional.findMany({
            include: {
                categories: true
            },
            orderBy: {
                price: 'asc'
            }
        })

        return { 
            data: additionals,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getAdditionalId = async (id: string) => {
    try {
        const additional = await db.additional.findUnique({
            where: {
                id: id
            },
            include: {
                categories: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!additional) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: additional,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createAdditional = async (data: z.infer<typeof AdditionalCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AdditionalCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const additional = await db.additional.create({
            data: {
                name: data.name,
                status: data?.status || false,
                price: data.price,
                categories: {
                    connect: data.categoryIds.map((categoryId) => ({
                        id: categoryId
                    }))
                },
            }
        })

        return {
            data: additional,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateAdditional = async (data: z.infer<typeof AdditionalUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AdditionalUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const additional = await db.additional.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!additional) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateAdditional = await db.additional.update({
            where: {
                id: additional.id,
            },
            data: {
                name: data.name,
                status: data?.status || false,
                price:  data.price,
                categories: data.categoryIds ? {
                    disconnect: additional.categoryIds?.map((categoryId) => ({
                        id: categoryId
                    })),
                    connect: data.categoryIds?.map((categoryId) => ({
                        id: categoryId
                    })),
                } : undefined,
            }
        })

        return {
            data: updateAdditional,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const deleteAdditional = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }


        const additional = await db.additional.findUnique({
            where: {
                id
            },
            include: {
                categories: true
            }
        })


        if (additional?.categories?.length) {
            await db.additional.update({
                where: {
                    id: additional.id
                },
                data: {
                    categories: {
                        disconnect: additional.categories.map((category) => ({
                            id: category.id
                        }))
                    }
                }
            });
        }

        const deleteAdditional = await db.additional.delete({
            where: {
                id: id
            },

        });

        return {
            data: deleteAdditional,
            success: 'Deletado com sucesso',
        }

    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}