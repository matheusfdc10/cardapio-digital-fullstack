'use client'

import React, { useState } from "react";
import Img from "next/image"
import { cn } from "@/lib/utils";
import Modal from "@/components/modals";
import { ResponsiveModal } from "./modals/responsive-modal";
import { DialogClose } from "./ui/dialog";
import { XIcon } from "lucide-react";

interface ImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    width?: number | `${number}` | undefined;
    height?: number | `${number}` | undefined;
    modal?: boolean;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fill,
    className,
    width,
    height,
    modal
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [modalState, setModalState] = useState(false)

    return (
        <>  
            {modal && (
                <ResponsiveModal
                    open={modalState}
                    onOpenChange={setModalState}
                    paddingNone
                >
                    <DialogClose className="absolute p-1 bg-white shadow-sm top-2 right-2 rounded-full">
                        <XIcon className=""/>
                    </DialogClose>
                    <Image 
                        src={isLoading ? "/images/loading.jpg" : src }
                        alt={alt}
                        width={500}
                        height={500}
                        className="object-cover bg-white w-full aspect-square"
                    />
                </ResponsiveModal>
            )}

            {fill ? (
                <Img 
                    src={isLoading ? "/images/loading.jpg" : src }
                    onClick={() => modal && setModalState(true)}
                    alt={alt}
                    fill
                    onLoadingComplete={() => setIsLoading(false)}
                    className={cn(
                        "object-cover bg-white w-full aspect-square",
                        isLoading && "animate-spin",
                        modal && "cursor-pointer",
                        className,
                    )}
                />
            ) : (
                <Img
                    src={isLoading ? "/images/loading.jpg" : src }
                    alt={alt}
                    width={width}
                    height={height}
                    onLoadingComplete={() => setIsLoading(false)}
                    className={cn(
                        "object-cover bg-white w-full aspect-square",
                        isLoading && "animate-spin",
                        className,
                    )}
                />
            )}
        </>
    )
}
 
export default Image;