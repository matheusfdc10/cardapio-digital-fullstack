"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DishCategoryType } from "@/types";
import { UserRole } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { redirect  } from "next/navigation";


export type DishCategoryUpdate = Omit<DishCategoryType, "name" | "status" | "order" | "description" | "createdAt" | "updatedAt" | "dishes"> & {
    name?: string;
    status?: boolean;
    order?:  number;
    description?: string;
}

export type DishCategoryCreate = Omit<DishCategoryType, "id" | "createdAt" | "updatedAt" | "order" | "dishes"> & {
    
}

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
            success: 'Categorias de pratos'
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
                error: 'Categoria de prato não encontrada'
            }
        }

        return {
            data: dishCategory,
            success: 'Sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const createDishCategory = async (data: DishCategoryCreate) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: null,
                error: "Não autorizado"
            }
        }

        const order = await getLastOrderDishCategory();

        if (!order) {
            return {
                data: null,
                error: "Não foi possível criar categoria de prato"
            }
        }

        const dishCategory = await db.dishCategory.create({
            data: {
                name: data.name,
                status: data.status,
                order: order,
            }
        })

        return {
            data: dishCategory,
            success: 'Categoria de prato criada com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateDishCategory = async (data: DishCategoryUpdate) => {
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
                id: data.id
            }
        })
        
        if (!dishCategory) {
            return {
                data: null,
                error: "Categoria de prato não encontrada"
            }
        }

        const updateDishCategory = await db.dishCategory.update({
            where: {
                id: dishCategory.id,
            },
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
                order: data.order,
            }
        })

        return {
            data: updateDishCategory,
            success: 'Categoria de prato atualizada com sucesso',
        }
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado'
        }
    }
}

export const updateManyDishCategories = async (data: DishCategoryUpdate[]) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return {
                data: [],
                error: "Não autorizado"
            }
        }

        await Promise.all(data.map(async (item, index) => {
            await db.dishCategory.update({
                where: {
                    id: item.id
                },
                data: {
                    name: item?.name,
                    description: item?.description,
                    status: item?.status,
                    order: index,
                }
            })
        }))

        const categories = (await getDishCategories()).data

        return {
            data: categories,
            success: 'Categorias de pratos atualizadas com sucesso',
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

        const dishCategory = await db.dishCategory.delete({
            where: {
                id: id
            }
        });

        return {
            data: dishCategory,
            success: 'Categoria de prato deletada com sucesso',
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