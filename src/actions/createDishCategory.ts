"use server"

import { DishCategoryFormValues } from "@/app/(dashboard)/menu/categories/[dishCategoryId]/_components/dish-category-form";
import { auth } from "@/auth";
import { createDishCategoryFromDb } from "@/data/dishCategory";
import { UserRole } from "@prisma/client";

export const createDishCategory = async (data: DishCategoryFormValues) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return null;
        }

        const category = await createDishCategoryFromDb(data);

        return category;
    } catch(error) {
        return;
    }
}