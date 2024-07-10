import { DishCategory, Dish, AdditionalCategory, Additional, Restaurant, Address, User, OpeningHours, DeliveryArea } from "@prisma/client";

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
    openingHours?: OpeningHours[] | null;
    deliveryAreas?: DeliveryArea[] | null;
}

export type AddressType = Address & {
    restaurant?: Restaurant | null;
    user?: User | null;
}

export type OpeningHoursType = OpeningHours & {
    restaurant?: Restaurant | null;
}

export type DeliveryAreaType = DeliveryArea & {
    restaurant?: Restaurant | null;
}