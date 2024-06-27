import { DishCategory, Dish, AdditionalCategory } from "@prisma/client";

export type DishCategoryType = Omit<DishCategory, 'description'> & {
    dishes: Dish[]
}

export type DishType = Dish & {
    category: DishCategory
    additionalCategories: AdditionalCategory[]
}