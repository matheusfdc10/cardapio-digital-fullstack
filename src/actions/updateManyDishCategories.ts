"use server"

import { auth } from "@/auth";
import { DishCategoryType, updateManyDishCategoriesFromDb } from "@/data/dishCategory";
import { UserRole } from "@prisma/client";

export const updateManyDishCategories = async (data: DishCategoryType[]) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return [];
        }

        const categories = await updateManyDishCategoriesFromDb(data);

        return categories;
    } catch(error) {
        return [];
    }
}