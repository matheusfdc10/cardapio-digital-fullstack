"use client"

import Modal from "@/components/modals";
import { Button } from "@/components/ui/button";
import useCart, { CartItemType } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import CartForm from "./cart-form";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

type Props = {
    item: CartItemType
}
export const CartItem = ({
    item
}: Props) => {
    const cart = useCart()
    // const [modalState, setModalState] = useState(false)

    const totalPrice = (item: CartItemType) => {
        return (item.additionalCategories.reduce((value, category) => value + category.additionals.reduce((value2, additonal) => value2 + (additonal.quantity ? additonal.quantity * additonal.price : 0),0), 0) + item.price) * item.quantity
    }

    return (
        <>
            {/* <Modal
                onClose={() => setModalState(false)}
                isOpen={modalState}
                smFull
            >
                <CartForm dish={} initialData={item} onClose={() => setModalState(false)}/>
            </Modal> */}
            <li 
                className="space-y-1 py-2"
            >
                <div className="flex justify-between">
                    <span className="font-medium">
                        {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold ml-2">
                        {formatPrice(totalPrice(item))}
                    </span>
                </div>
                <div className="text-sm text-muted-foreground">
                    {item.additionalCategories.flatMap((category) => 
                        category.additionals.filter((additional) => additional.quantity)
                    ).map((additional, index, array) => (
                        <span key={index}>
                            {additional.quantity}x {additional.name}
                            {index < array.length - 1 && ', '}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-3">
                        <button
                            onClick={() => cart.updateItemFromCart({
                                ...item,
                                quantity: item.quantity - 1
                            })}
                            className='rounded-full bg-red-500 p-1 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
                        >
                            <IoMdRemove className='w-6 h-6 text-white'/>
                        </button>
                        <span className="font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => cart.updateItemFromCart({
                                ...item,
                                quantity: item.quantity + 1
                            })}
                            className='rounded-full bg-green-500 disabled:opacity-50 p-1 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
                        >
                            <IoMdAdd className='w-6 h-6 text-white'/>
                        </button>
                    </div>
                    <div className="space-x-2">
                        {/* <Button
                            size="sm"
                            variant="secondary"
                        >
                            Editar
                        </Button> */}
                        <Button
                            onClick={() => cart.removeFromCart(item.id)}
                            size="sm"
                            variant="destructive"
                        >
                            Remover
                        </Button>
                    </div>
                </div>
            </li>
        </>
    );
}