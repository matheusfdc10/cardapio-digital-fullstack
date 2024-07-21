"use client"

import { MenuType } from "@/types";
import { MenuItem } from "./menu-item";
import { MenuSection } from "./menu-section";
import { useContext } from "react";
import { removeAccents } from "@/lib/utils";
import { MenuContext } from "@/contexts/menu";


type MenuProps = {
    data: MenuType[]
}

export const Menu = ({
    data
}: MenuProps) => {
    const { searchDish } = useContext(MenuContext);
    
    const filteredData = data.map(category => ({
        ...category,
        dishes: category.dishes.filter(dish =>
            removeAccents(dish.name).includes(removeAccents(searchDish)) ||
            removeAccents(dish.description || '').includes(removeAccents(searchDish))
        )
    })).filter(category => category.dishes.length > 0);

    return ( 
        <>
            <div className="mx-6 mt-4 sm:mx-8">            
                {filteredData.length ? (
                    filteredData.map((category) => (
                        <MenuSection
                            key={category.id}
                            data={category}
                        >
                            {category.dishes?.map((dish) => (
                                <MenuItem
                                    key={dish.id}
                                    data={dish}
                                />
                            ))}
                        </MenuSection>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-2xl font-bold text-gray-500">
                            Nenhum resultado
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}