"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DishSchema } from "@/schemas/dish";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const DishUpdate = DishSchema.extend({
    status: z.boolean().optional(),
    name: z.string().optional(),
    price: z.coerce.number().min(0.00).optional(),
    categoryId: z.string().min(1).optional(),
    additionalCategoryIds: z.string().array().optional(),
}).omit({ createdAt: true, dishes: true, updatedAt: true })


const DishCreate = DishSchema.extend({
    status: z.boolean().optional()
}).omit({ id: true, createdAt: true, updatedAt: true })


export const getDishes = async (dishCategoryId?: string) => {
    try {
        const dishes = await db.dish.findMany({
            where: {
                categoryId: dishCategoryId
            },
            include: {
                category: true,
                additionalCategories: {
                    include: {
                        additionals: {
                            orderBy: {
                                price: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
            },
            orderBy: {
                price: 'asc',
            }
        })

        return { 
            data: dishes,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getDishById = async (id: string) => {
    try {
        const dish = await db.dish.findUnique({
            where: {
                id: id
            },
            include: {
                category: true,
                additionalCategories: {
                    include: {
                        additionals: {
                            orderBy: {
                                price: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
            }
        })

        if (!dish) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: dish,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createDish = async (data: z.infer<typeof DishCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DishCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const dish = await db.dish.create({
            data: {
                name: data.name,
                status: data?.status || false,
                price: data.price,
                description: data.description,
                image: data.image,
                categoryId: data.categoryId,
                // additionalCategoryIds: data.additionalCategoryIds,
                additionalCategories: {
                    connect: data.additionalCategoryIds.map((additionalCategoryId) => ({
                        id: additionalCategoryId
                    }))
                }
            }
        })

        return {
            data: dish,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateDish = async (data: z.infer<typeof DishUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DishUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const dish = await db.dish.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!dish) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateDish = await db.dish.update({
            where: {
                id: dish.id,
            },
            data: {
                name: data.name,
                description: data.description,
                status: data.status || false,
                price: data.price,
                image: data.image,
                categoryId: data.categoryId,
                // additionalCategoryIds: {
                //     set: data.additionalCategoryIds
                // },
                additionalCategories: data.additionalCategoryIds ? {
                    // set: [],
                    disconnect: dish.additionalCategoryIds.map((additionalCategoryId) => ({
                        id: additionalCategoryId
                    })),
                    connect: data.additionalCategoryIds.map((additionalCategoryId) => ({
                        id: additionalCategoryId
                    })),
                } : undefined
            }
        })

        // atualizar adicionalCategory
        // if (data.additionalCategoryIds.length) {

        // }

        return {
            data: updateDish,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const deleteDish = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const dish = await db.dish.delete({
            where: {
                id: id,
            },
        });

        // atualizar adicionalCategory

        return {
            data: dish,
            success: 'Deletado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}
