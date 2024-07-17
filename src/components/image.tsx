'use client'

import React, { useState } from "react";
import Img from "next/image"
import { cn } from "@/lib/utils";

interface ImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    width?: number | `${number}` | undefined;
    height?: number | `${number}` | undefined
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fill,
    className,
    width,
    height
}) => {
    const [isLoading, setIsLoading] = useState(true)

    return fill ? (
        <Img 
            src={isLoading ? "/images/loading.jpg" : src }
            alt={alt}
            fill
            onLoadingComplete={() => setIsLoading(false)}
            className={cn(
                "object-cover bg-white",
                isLoading && "animate-spin",
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
    )
}
 
export default Image;