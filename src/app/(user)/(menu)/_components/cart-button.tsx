"use client"

import useCart from "@/hooks/useCart";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
    height?: number;
    width? : number;
    fontSize?: number;
}

export const CartButton = ({
    height,
    width,
    fontSize
}: Props) => {
    const cartState = useCart()

    return ( 
        <div className="relative cursor-pointer sm:hover:scale-[1.03] sm:active:scale-100">
            {!!cartState.totalItems && (
                <span 
                    className="absolute bg-red-500 text-white font-semibold rounded-full w-6 h-6 pt-[1px] flex justify-center items-center text-xs -top-3 -right-5 "
                    style={{ fontSize, height: height && height - 2, width: width && width -2}}
                >
                    {cartState.totalItems}
                </span>
            )}
            <FaCartShopping 
                className="w-6 h-6" 
                style={{
                    height: height,
                    width: width
                }}
            />
        </div>
    );
}