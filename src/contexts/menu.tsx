"use client"

import { RestaurantType } from "@/types";
import { createContext, useState } from "react";

type MenuProvider = {
    restaurant: RestaurantType | null;
    searchDish: string;
    setSearchDish: (Search: string) => void;
}

export const MenuContext = createContext<MenuProvider>({
    restaurant: null,
    searchDish: '',
    setSearchDish: () => {}
});

export function MenuProvider({
    children,
    restaurant,
} : {
    children: React.ReactNode;
    restaurant: RestaurantType;
}) {
    const [searchDish, setSearchDish] = useState<string>("");

    return (
        <MenuContext.Provider
            value={{
                restaurant: restaurant,
                searchDish: searchDish,
                setSearchDish: setSearchDish,
            }}
        >
            {children}
        </MenuContext.Provider>
    )
}