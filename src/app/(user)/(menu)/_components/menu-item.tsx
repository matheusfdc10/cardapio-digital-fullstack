"use client"

import Image from "@/components/image";
import Modal from "@/components/modals";
import { formatPrice } from "@/lib/utils";
import { MenuType } from "@/types";
import CartForm from "./cart-form";
import { useState } from "react";

type MenuItemProps = {
    data: MenuType['dishes'][number]
}

export const MenuItem = ({
    data,
}: MenuItemProps) => {
    const [modalState, setModalState] = useState(false)



    return (
        <>  
            <Modal
                onClose={() => setModalState(false)}
                isOpen={modalState}
                smFull
            >
                <CartForm dish={data} onClose={() => setModalState(false)}/>
            </Modal>
            <li
                onClick={() => setModalState(true)}
                className="min-h-[146px] cursor-pointer border rounded-md p-4 flex justify-between gap-4 shadow-md hover:border-neutral-300/80 hover:shadow-lg transition overflow-hidden"
            >
                <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                    <h3 
                        title={data.name} 
                        className="text-lg sm:text-xl font-bold leading-none line-clamp-2"
                    >
                        {data.name}
                    </h3>
                    <p 
                        title={data.description || undefined} 
                        className="leading-tight text-sm font-medium text-muted-foreground line-clamp-2"
                    >
                        {data.description}
                    </p>
                    </div>
                    <span className="text-red-500 font-bold">
                    {formatPrice(data.price)}
                    </span>
                </div>
                {data.image && (
                    <div className="w-28 h-28 rounded-md overflow-hidden relative border self-center">
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                    />
                    </div>
                )}
            </li>
        </>
    );
}