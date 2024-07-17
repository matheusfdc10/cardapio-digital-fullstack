'use client'

import React, { useState } from "react";
import Img from "next/image"
import { cn } from "@/lib/utils";
import Modal from "@/components/modals";

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
                <Modal
                    isOpen={modalState}
                    onClose={() => setModalState(false)}
                    image
                >
                    <Image 
                        src={isLoading ? "/images/loading.jpg" : src }
                        alt={alt}
                        width={680}
                        height={680}
                    />
                </Modal>
            )}

            {fill ? (
                <Img 
                    src={isLoading ? "/images/loading.jpg" : src }
                    onClick={() => modal && setModalState(true)}
                    alt={alt}
                    fill
                    onLoadingComplete={() => setIsLoading(false)}
                    className={cn(
                        "object-cover bg-white",
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
                        "object-cover bg-white",
                        isLoading && "animate-spin",
                        className,
                    )}
                />
            )}
        </>
    )
}
 
export default Image;