'use client'

import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { BsExclamationCircle } from "react-icons/bs";

interface ToastErrorProps {
    errorMessage: string;
    toastMessage: string;
    toastDescription?: string;
}

const ToastError: React.FC<ToastErrorProps> = ({
    errorMessage,
    toastMessage,
    toastDescription
}) => {

    useEffect(() => {
        toast({
            variant: 'destructive',
            title: toastMessage,
            description: toastDescription
        })
    }, [toastDescription, toastMessage])

    return (
        <div className="h-60 flex flex-col justify-center items-center gap-4 p-4">
            <BsExclamationCircle strokeWidth={0.1} className="w-10 h-10 text-red-400" />
            <p className="text-lg font-semibold text-center text-red-400">
                {errorMessage}
            </p>
        </div>
    );
}
 
export default ToastError;