"use server"

import { auth } from "@/auth";
import { DishCategoryType, updateDishCategoryFromDb } from "@/data/dishCategory";
import { UserRole } from "@prisma/client";

export const updateDishCategory = async (data: DishCategoryType) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return null;
        }

        const category = await updateDishCategoryFromDb(data);

        return category;
    } catch(error) {
        return;
    }
}