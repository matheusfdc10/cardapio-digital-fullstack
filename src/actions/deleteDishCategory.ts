"use server"

import { auth } from "@/auth";
import { deleteDishCategoryFromDb } from "@/data/dishCategory"
import { UserRole } from "@prisma/client";

export const deleteDishCategory = async (dishCategoryId: string) => {
    try {
        const session = await auth();

        if (session?.user.role !== UserRole.ADMIN) {
            return null;
        }

        const dishCategory = await deleteDishCategoryFromDb(dishCategoryId);

        return dishCategory;
    } catch(error) {
        return;
    }
}