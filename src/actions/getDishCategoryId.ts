"use server"

import { getDishCategoryIdFromDb } from "@/data/dishCategory";

export default async function getDishCategoryId(dishCategoryId: string) {
    try {
        const dishCategory = await getDishCategoryIdFromDb(dishCategoryId)

        if (!dishCategory) {
            return null
        }

        return dishCategory;
    } catch(error) {
        return null;
    }
}