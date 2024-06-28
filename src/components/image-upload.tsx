'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUplodProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    amount: number;
}

const ImageUpload: React.FC<ImageUplodProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    amount = 1
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if (!isMounted) {
        return null
    }


    return (
        <div className="space-y-4">
            {value.map((url) => (
                <div 
                    key={url}
                    className="flex items-center gap-4 flex-wrap"
                >
                    <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                disabled={disabled}
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            sizes="200"
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                </div>
            ))}
            {(value.length < amount) && (
                <CldUploadWidget onUpload={onUpload} uploadPreset="n2ebtrb2">
                    {({ open }) => {
                        const onClick = () => {
                            open();
                        }
                        
                        return (
                            <Button
                                type="button"
                                disabled={disabled}
                                variant="secondary"
                                onClick={onClick}
                            >
                                <ImagePlus className="w-4 h-4 mr-2"/>
                                Adicionar imagem
                            </Button>
                        )
                    }}
                </CldUploadWidget>
            )}
        </div>
    )
}

export default ImageUpload;