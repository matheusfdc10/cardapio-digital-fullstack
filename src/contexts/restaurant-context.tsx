"use client"

import { RestaurantType } from "@/types";
import { createContext } from "react";

export const RestaurantContext = createContext<RestaurantType | null>(null);

export function RestaurantProvider({
    children,
    restaurant,
} : {
    children: React.ReactNode;
    restaurant: RestaurantType;
}) {
    return (
        <RestaurantContext.Provider value={restaurant}>
            {children}
        </RestaurantContext.Provider>
    )
}