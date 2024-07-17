"use client"

import { MenuType } from "@/types";
import { MenuItem } from "./menu-item";
import { MenuSection } from "./menu-section";
import { useState } from "react";
import { removeAccents } from "@/lib/utils";
import { InputSearch } from "./input-search";


type MenuProps = {
    data: MenuType[]
}

export const Menu = ({
    data
}: MenuProps) => {
    const [search, setSearch] = useState("")

    const filteredData = data.map(category => ({
        ...category,
        dishes: category.dishes.filter(dish =>
            removeAccents(dish.name).includes(removeAccents(search)) ||
            removeAccents(dish.description || '').includes(removeAccents(search))
        )
    })).filter(category => category.dishes.length > 0);

    return ( 
        <>
            <div className="mx-6 sm:mx-8 my-6">
                <InputSearch 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por um item"
                    search={search}
                    onClear={() => setSearch("")}
                />
            </div>
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