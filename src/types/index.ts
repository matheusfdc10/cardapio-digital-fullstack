import { DishCategory, Dish, AdditionalCategory, Additional } from "@prisma/client";

export type DishCategoryType = Omit<DishCategory, 'description'> & {
    dishes: Dish[]
}

export type DishType = Dish & {
    category: DishCategory
    additionalCategories: AdditionalCategory[]
}

export type AdditionalCategoryType = AdditionalCategory & {
    dishes: Dish[]
    additionals: Additional[]
}