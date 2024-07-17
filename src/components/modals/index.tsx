'use client'

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
    title?: string;
    description?: string;
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: number;
    smFull?: boolean
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description,
    maxWidth,
    smFull,
}) => {

    const onChange = () => {
        onClose();
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) return
        const body = document.getElementsByTagName("body");
        body[0].classList.add("overflow-hidden");
        return () => {
            body[0].classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='fixed z-[50] w-screen h-screen top-0 left-0 right-0'>
            <div 
                className='relative w-full h-full bg-zinc-900/50 backdrop-blur-sm'
            >
                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div
                        onClick={handleOutsideClick}
                        className={cn(
                            'flex min-h-full items-center justify-center',
                            smFull ? 'px-0 py-0 sm:px-4 sm:py-8' : 'px-4 py-8'
                        )}
                    >   
                        <div className={cn(
                            `relative z-50 bg-white shadow-md w-full flex flex-col`,
                            maxWidth ? '' : 'max-w-[640px]',
                            smFull ? 'sm:rounded-lg overflow-y-auto sm:overflow-hidden h-screen sm:h-auto' : 'p-6 border rounded-lg'
                        )}
                            style={{
                                maxWidth: `${maxWidth}px`
                            }}
                        >
                            {!smFull && (
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
                                        onClick={onChange}
                                    >
                                        <X className="h-5 w-5"  aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                            {(title || description) && (
                                <div className='flex flex-col space-y-1.5 text-center sm:text-left mb-4'>
                                    <h2 className="text-xl font-semibold leading-none tracking-tight">
                                        {title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            )}
                            <div>
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
