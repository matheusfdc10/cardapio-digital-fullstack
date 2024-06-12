"use server"

import { getDishCategoriesFromDb } from "@/data/dishCategory"; 

export default async function getDishCategories() {
    try {
        const category = await getDishCategoriesFromDb()

        if (!category) {
            return []
        }

        return category;
    } catch(error) {
        return [];
    }
}