
"use client"

import { FaRegUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { PiNotepad } from "react-icons/pi";
import { RxHome } from "react-icons/rx";
import Link from "next/link";
import { InputSearch } from "./input-search";
import { useContext, useEffect, useRef, useState } from "react";
import { MenuContext } from "@/contexts/menu";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

type Props = {
 
}
export const TabBar = ({}: Props) => {
    const { setSearchDish } = useContext(MenuContext);
    const [inputSearchState, setInputSearchState] = useState(false);
    const cart = useCart();

    const handleInputSearchState = () => {
        setInputSearchState((prev) => !prev);
        setSearchDish("")
        if (!inputSearchState) {
            window.scrollTo({ top: 112, behavior: "smooth" });
        }
    }

    return (
        <div className="sticky bottom-0 bg-white sm:hidden border-t divide-y">
            {inputSearchState && (
                <div className="px-3">
                    <InputSearch autoFocus borderNone placeholder="Buscar por um item" />
                </div>
            )}

            {!!cart.totalAmount && (
                <div className="flex justify-between items-center gap-2 py-2 px-6">
                    <div>
                        <p className="font-medium text-sm text-muted-foreground">
                            Total
                        </p>
                        <span className="font-bold text-sm">
                            {formatPrice(cart.totalAmount)}
                        </span>
                        <span className="font-medium text-sm text-muted-foreground"> / {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'}</span>
                    </div>
                    <Button size="sm">
                        Ver sacola
                    </Button>
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