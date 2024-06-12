'use client'

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
    title: string;
    description?: string;
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description
}) => {

    useEffect(() => {
        const body = document.getElementsByTagName("body");
        body[0].classList.add("overflow-hidden");
        
        return () => {
            body[0].classList.remove("overflow-hidden");
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className='fixed z-40 w-screen h-screen top-0 left-0 right-0'>
            <div 
                className='relative w-full h-full bg-background/80 backdrop-blur-sm'
            >
                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div
                        className='
                            flex
                            min-h-full
                            items-center
                            justify-center
                            px-4
                            py-8
                            text-center
                            sm:px-0
                        '
                    >   
                        <div className='relative z-50 p-6 bg-white max-w-lg shadow-md border rounded-lg py-6 w-full'>
                            <div 
                                className="
                                    absolute 
                                    right-0 
                                    top-0 
                                    pr-3 
                                    pt-3
                                    sm:block
                                    z-10
                                "
                            >
                                <button
                                    type="button"
                                    className="
                                        rounded-md 
                                        bg-transparent
                                        text-neutral-950 
                                        hover:text-neutral-950/75 
                                    "
                                    onClick={onClose}
                                >
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                            <div className='flex flex-col space-y-1.5 text-center sm:text-left mb-4'>
                                <h2 className="text-lg font-semibold leading-none tracking-tight">
                                    {title}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
