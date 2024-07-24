
"use client"

import { FaRegUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { PiNotepad } from "react-icons/pi";
import { RxHome } from "react-icons/rx";
import Link from "next/link";
import { InputSearch } from "./input-search";
import { useContext, useState } from "react";
import { MenuContext } from "@/contexts/menu";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { TiDelete } from "react-icons/ti";
import Cart from "./cart";

type Props = {
 
}
export const TabBar = ({}: Props) => {
    const { setSearchDish, searchDish } = useContext(MenuContext);
    const [inputSearchState, setInputSearchState] = useState(false);
    const cart = useCart();

    const handleInputSearchState = () => {
        setInputSearchState((prev) => !prev);
        setSearchDish("")
    }

    return (
        <div className="sticky bottom-0 z-10 bg-white sm:hidden border-t divide-y">
            {(inputSearchState || searchDish) && (
                <div className="px-3 flex items-center">
                    <InputSearch autoFocus borderNone buttonClearNone placeholder="Buscar por um item" />
                    <TiDelete
                        onClick={handleInputSearchState}
                        className="mr-3 w-6 h-6 text-gray-400 cursor-pointer"
                    />
                </div>
            )}

            {!!cart.totalAmount && (
                <div className="flex justify-between items-center gap-2 py-2 px-6">
                    <div>
                        <p className="font-medium text-sm text-muted-foreground">
                            Total
                        </p>
                        <span className="font-semibold">
                            {formatPrice(cart.totalAmount)}
                        </span>
                        <span className="font-medium text-sm text-muted-foreground"> / {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'}</span>
                    </div>
                    <Cart />
                    {/* <Button size="sm">
                        Ver sacola
                    </Button> */}
                </div>
            )}

            <div className="grid grid-cols-4 justify-items-center items-center">
                <Link href="/" className="flex flex-col justify-center gap-1 items-center w-full py-2 cursor-pointer">
                    <RxHome className="w-6 h-6" />
                    <span className="font-semibold text-xs">
                        Início
                    </span>
                </Link>

                <div
                    onClick={handleInputSearchState}
                    className="flex flex-col justify-center gap-1 items-center w-full py-2 cursor-pointer"
                >
                    <IoSearch className="w-6 h-6" />
                    <span className="font-semibold text-xs">
                        Buscar
                    </span>
                </div>

                <div className="flex flex-col justify-center gap-1 items-center w-full py-2 cursor-pointer">
                    <PiNotepad className="w-6 h-6"/>
                    <span className="font-semibold text-xs">
                        Pedidos
                    </span>
                </div>

                <div className="flex flex-col justify-center gap-1 items-center w-full py-2 cursor-pointer">
                    <FaRegUser className="w-6 h-6" />
                    <span className="font-semibold text-xs">
                        Perfil
                    </span>
                </div>
            </div>
        </div>
    );
}