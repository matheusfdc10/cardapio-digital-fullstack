"use client"

import useCart from "@/hooks/useCart";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
 
}
export const CartButton = ({}: Props) => {
    const cartState = useCart()

    return ( 
        <div className="relative cursor-pointer hover:scale-[1.03] active:scale-100">
            <span className="absolute bg-red-500 text-white font-semibold rounded-full w-6 h-6 flex justify-center items-center text-xs -top-3 -right-5 ">
                {cartState.totalItems}
            </span>
            <FaCartShopping className="w-6 h-6"/>
        </div>
    );
}