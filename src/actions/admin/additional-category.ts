"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdditionalCategorySchema } from "@/schemas/additional-category";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const AdditionalCategoryUpdate = AdditionalCategorySchema.extend({
    name: z.string().optional(),
    status: z.boolean().optional(),
    isRequired: z.boolean().optional(),
    maxItems: z.coerce.number().default(0).optional(),
    additionalIds: z.string().array().optional(),
    dishIds: z.string().array().optional(),
}).omit({ createdAt: true, updatedAt: true })

const AdditionalCategoryCreate = AdditionalCategorySchema.extend({
    status: z.boolean().optional()
}).omit({ id: true, createdAt: true, order: true, updatedAt: true, })


export const getAdditionalCategories = async () => {
    try {
        const additionalCategory = await db.additionalCategory.findMany({
            include: {
                dishes: true,
                additionals: true,
            },
            orderBy: {
                order: 'asc'
            }
        })

        return { 
            data: additionalCategory,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getAdditionalCategoryId = async (id: string) => {
    try {
        const additionalCategory = await db.additionalCategory.findUnique({
            where: {
                id: id
            },
            include: {
                dishes: {
                    include: {
                        category: true,
                        additionalCategories: true,
                    }
                },
                additionals: true,
            }
        })

        if (!additionalCategory) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: additionalCategory,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createAdditionalCategory = async (data: z.infer<typeof AdditionalCategoryCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AdditionalCategoryCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const order = await getLastOrderAdditionalCategory();

        if (!order) {
            return {
                data: null,
                error: "Não foi possível criar"
            }
        }

        const additionalCategory = await db.additionalCategory.create({
            data: {
                name: data.name,
                description: data.description,
                status: data?.status || false,
                order: order,
                isRequired: data.isRequired,
                maxItems: data.maxItems,
                additionals: {
                    connect: data.additionalIds.map((additionalId) => ({
                        id: additionalId
                    }))
                },
                dishes: {
                    connect: data.dishIds.map((dishId) => ({
                        id: dishId
                    }))
                }
            }
        })

        return {
            data: additionalCategory,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateAdditionalCategory = async (data: z.infer<typeof AdditionalCategoryUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = AdditionalCategoryUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const additionalCategory = await db.additionalCategory.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!additionalCategory) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateAdditionalCategory = await db.additionalCategory.update({
            where: {
                id: additionalCategory.id,
            },
            data: {
                name: data.name,
                description: data.description,
                status: data?.status || false,
                order: data.order,
                isRequired: data.isRequired,
                maxItems: data.maxItems,
                additionals: data.additionalIds ? {
                    disconnect: additionalCategory.additionalIds?.map((additionalId) => ({
                        id: additionalId
                    })),
                    connect: data.additionalIds?.map((additionalId) => ({
                        id: additionalId
                    })),
                } : undefined,
                dishes: data.dishIds ? {
                    disconnect: additionalCategory.dishIds?.map((dishId) => ({
                        id: dishId
                    })),
                    connect: data.dishIds?.map((dishId) => ({
                        id: dishId
                    })),
                } : undefined
            }
        })

        return {
            data: updateAdditionalCategory,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateManyAdditionalCategories = async (data: z.infer<typeof AdditionalCategoryUpdate>[]) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: [],
                error: "Não autorizado"
            }
        }
        
        const validatedFields = AdditionalCategoryUpdate.array().safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        await Promise.all(data.map(async (item, index) => {
            await db.additionalCategory.update({
                where: {
                    id: item.id
                },
                data: {
                    order: item.order || index,
                }
            })
        }))

        const categories = (await getAdditionalCategories()).data;

        return {
            data: categories,
            success: 'Atualizadas com sucesso',
        }
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado'
        }
    }
}

export const deleteAdditionalCategory = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }


        const additionalCategory = await db.additionalCategory.findUnique({
            where: {
                id
            },
            include: {
                dishes: true,
                additionals: true,
            }
        })


        if (additionalCategory?.dishes?.length || additionalCategory?.additionals?.length) {
            return {
                data: null,
                error: "Não é possível excluir uma categoria com pratos e/ou adicionais associados"
            }
        }

        const deleteAdditionalCategory = await db.additionalCategory.delete({
            where: {
                id: id
            },
        });

        return {
            data: deleteAdditionalCategory,
            success: 'Deletado com sucesso',
        }

    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

const getLastOrderAdditionalCategory = async () => {
    try {
        const additionalCategory = await db.additionalCategory.findFirst({
            orderBy: {
                order: 'desc',
            },
        });

        const order = additionalCategory?.order || 0

        return order + 1;
    } catch(error) {
        return null;
    }
}