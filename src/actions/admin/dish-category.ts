"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DishCategorySchema } from "@/schemas/dish-category";
import { DishCategoryType } from "@/types";
import { UserRole } from "@prisma/client";
import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { redirect  } from "next/navigation";


// export type DishCategoryUpdate = Omit<DishCategoryType, "name" | "status" | "order" | "description" | "createdAt" | "updatedAt" | "dishes"> & {
//     name?: string;
//     status?: boolean;
//     order?:  number;
//     description?: string;
// }

// export type DishCategoryCreate = Omit<DishCategoryType, "id" | "createdAt" | "updatedAt" | "order" | "dishes"> & {
    
// }

const DishCategoryUpdate = DishCategorySchema.extend({
    status: z.boolean().optional(),
    name: z.string().optional()
}).omit({ createdAt: true, dishes: true, updatedAt: true })


const DishCategoryCreate = DishCategorySchema.extend({
    status: z.boolean().optional()
}).omit({ id: true, createdAt: true, dishes: true, order: true, updatedAt: true, description: true })


export const getDishCategories = async () => {
    try {
        const dishCategories = await db.dishCategory.findMany({
            include: {
                dishes: true,
            },
            orderBy: {
                order: 'asc'
            }
        })

        return { 
            data: dishCategories,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: [],
            error: 'Algo deu errado',
        }
    }
}

export const getDishCategoryId = async (id: string) => {
    try {
        const dishCategory = await db.dishCategory.findUnique({
            where: {
                id: id
            },
            include: {
                dishes: {
                    include: {
                        category: true,
                        additionalCategories: true,
                    }
                }
            }
        })

        if (!dishCategory) {
            return {
                data: null,
                error: 'Não encontrado'
            }
        }

        return {
            data: dishCategory,
            success: 'Success',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createDishCategory = async (data: z.infer<typeof DishCategoryCreate>) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DishCategoryCreate.safeParse(data);

        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const order = await getLastOrderDishCategory();

        if (!order) {
            return {
                data: null,
                error: "Não foi possível criar"
            }
        }

        const dishCategory = await db.dishCategory.create({
            data: {
                name: data.name,
                status: data?.status || false,
                order: order,
            }
        })

        return {
            data: dishCategory,
            success: 'Criado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateDishCategory = async (data: z.infer<typeof DishCategoryUpdate>) => {
    try {
        const session = await auth();
        
        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const validatedFields = DishCategoryUpdate.safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        const dishCategory = await db.dishCategory.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!dishCategory) {
            return {
                data: null,
                error: "Não encontrado"
            }
        }

        const updateDishCategory = await db.dishCategory.update({
            where: {
                id: dishCategory.id,
            },
            data: {
                name: data?.name,
                // description: data.description,
                status: data?.status,
                order: data?.order
            }
        })

        return {
            data: updateDishCategory,
            success: 'Atualizado com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateManyDishCategories = async (data: z.infer<typeof DishCategoryUpdate>[]) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: [],
                error: "Não autorizado"
            }
        }

        const validatedFields = DishCategoryUpdate.array().safeParse(data);
        
        if (!validatedFields.success) {
            return {
                data: null,
                error: "Dados inválidos"
            }
        }

        await Promise.all(data.map(async (item, index) => {
            await db.dishCategory.update({
                where: {
                    id: item.id
                },
                data: {
                    name: item?.name,
                    // description: item?.description,
                    status: item?.status,
                    order: index,
                }
            })
        }))

        const categories = (await getDishCategories()).data;

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

export const deleteDishCategory = async (id: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }


        const dishCategory = await db.dishCategory.findUnique({
            where: {
                id
            },
            include: {
                dishes: true
            }
        })


        if (dishCategory?.dishes?.length) {
            return {
                data: null,
                error: "Não é possível excluir uma categoria com pratos associados"
            }
        }

        const deleteDishCategory = await db.dishCategory.delete({
            where: {
                id: id
            }
        });

        return {
            data: deleteDishCategory,
            success: 'Deletado com sucesso',
        }

    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

const getLastOrderDishCategory = async () => {
    try {
        const dishCategory = await db.dishCategory.findFirst({
            orderBy: {
                order: 'desc',
            },
        });

        const order = dishCategory?.order || 0

        return order + 1;
    } catch(error) {
        return null;
    }
}