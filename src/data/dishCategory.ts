import { DishCategoryFormValues } from "@/app/(dashboard)/menu/categories/[dishCategoryId]/_components/dish-category-form";
import { db } from "@/lib/db";
import { DishCategory } from "@prisma/client";

export type DishCategoryType = Omit<DishCategory, "name" | "status" | "order" | "description" | "createdAt" | "updatedAt"> & {
    name?: string;
    status?: boolean;
    order?:  number;
    description?: string;
}

export const getDishCategoriesFromDb = async () => {
    try {
        const dishCategories = await db.dishCategory.findMany({
            include: {
                dishes: true,
            },
            orderBy: {
                order: 'asc'
            }
        })
        return dishCategories;
    } catch(error) {
        return null;
    }
}

export const getDishCategoryIdFromDb = async (dishCategoryId: string) => {
    try {
        const dishCategory = await db.dishCategory.findUnique({
            where: {
                id: dishCategoryId
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

        return dishCategory;
    } catch(error) {
        return null;
    }
}

export const createDishCategoryFromDb = async (data: DishCategoryFormValues) => {
    try {

        const order = await getLastOrderDishCategory();

        if (!order) {
            return null;
        }

        const dishCategory = await db.dishCategory.create({
            data: {
                name: data.name,
                status: data.status,
                order: order,
            }
        })

        return dishCategory;
    } catch(error) {
        return null;
    }
}

export const updateDishCategoryFromDb = async (data: DishCategoryType) => {
    try {
        const dishCategory = await db.dishCategory.findUnique({
            where: {
                id: data.id
            }
        })
        
        if (!dishCategory?.id) {
            return null;
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

        return updateDishCategory;
    } catch(error) {
        return null;
    }
}

export const deleteDishCategoryFromDb = async (dishCategoryId: string) => {
    try {
        const dishCategory = await db.dishCategory.delete({
            where: {
                id: dishCategoryId
            }
        });

        return dishCategory;
    } catch(error) {
        return null;
    }
}

export const updateManyDishCategoriesFromDb = async (data: DishCategoryType[]) => {
    try {

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

        const categories = await getDishCategoriesFromDb()
        
        return categories;
    } catch(error) {
        return [];
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

