import { cn } from "@/lib/utils";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

export interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
    search?: string;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
    ({ className, onClear, search = "", type, ...props }, ref) => {
        return ( 
            <div className="relative max-w-sm sm w-full flex items-center">
                <IoSearchOutline className="absolute left-3 w-6 h-6 text-gray-500" />
                <input
                    type={type}
                    className={cn(
                        "w-full pl-12 pr-10 py-2 h-12 rounded-md border focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-300",
                        className
                    )}
                    ref={ref}
                    {...props}
                
                />
                {!!search.length && (
                    <TiDelete
                        onClick={() => onClear && onClear()}
                        className="absolute right-3 w-6 h-6 text-gray-400 cursor-pointer"
                    />
                )}
            </div>
        );
    }
)

InputSearch.displayName = "Input"

export { InputSearch }