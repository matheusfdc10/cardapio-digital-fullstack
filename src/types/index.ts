import { DishCategory, Dish, AdditionalCategory, Additional, Restaurant, Address } from "@prisma/client";

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

export type AdditionalType = Additional & {
    categories: AdditionalCategory[]
}

export type RestaurantType = Restaurant & {
    address?: Address | null;
}