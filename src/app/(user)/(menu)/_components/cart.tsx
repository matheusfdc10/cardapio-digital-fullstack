"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CartButton } from "./cart-button";
import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "./cart-item";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const Cart = () => {
    const cart = useCart()
    const [windowWidth, setWindowWidth] = useState<number | any>();
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        handleResize()
        
        window.addEventListener('resize', handleResize);
        
        // Remove o listener quando o componente é desmontado
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 640;

    return (
        <>
            <Popover modal={isMobile} open={isOpen} onOpenChange={(isOpen) =>setIsOpen(isOpen)}>
                <PopoverTrigger asChild>
                    {isMobile ? (
                        <Button size="sm">
                            Ver sacola
                        </Button>
                    ) : (
                        <button className="">
                            <CartButton />
                        </button>
                    )}
                </PopoverTrigger>
                <PopoverContent sideOffset={isMobile ? -100 : 4} className="w-screen h-[100dvh] sm:w-96 sm:h-auto">
                    <button className="absolute right-10 bg-white rounded-full p-1 sm:hidden" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5"  aria-hidden="true" />
                    </button>
                    {cart.totalAmount ? (
                        <>
                            <div className="max-h-[calc(100dvh-120px)] sm:max-h-[calc(100dvh-200px)] overflow-y-auto">
                                <h2>Seu pedido:</h2>
                                <ul className="flex flex-col divide-y">
                                    {cart.cart.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                </ul>
                            </div>
                            <div className="">
                                <div className="flex justify-between my-3 text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(cart.totalAmount)}</span>
                                </div>
                                <Button
                                    className="w-full"
                                >
                                    Escolher forma de pagamento
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-center">
                                Nenhum item no carrinho
                            </span>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
}
 
export default Cart;