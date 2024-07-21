"use client"

import { MenuContext } from "@/contexts/menu";
import { cn } from "@/lib/utils";
import React, { useContext, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

export interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    borderNone?: boolean
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
    ({ className, borderNone, ...props }, ref) => {
        const { searchDish, setSearchDish } = useContext(MenuContext);
        const inputRef = useRef<HTMLInputElement>(null);

        const handleSearchDish = (value: React.ChangeEvent<HTMLInputElement>) => {
            setSearchDish(value.target.value)
        }

        useEffect(() => {
            if (searchDish) {
                const adjustScrollPosition = () => {
                    const viewportWidth = window.innerWidth;
                    if (viewportWidth < 640) {
                        window.scrollTo({ top: 112, behavior: "smooth" });
                    } else {
                        window.scrollTo({ top: 144, behavior: "smooth" });
                    }
                };
    
                const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
                // Verificar se a altura da viewport muda, indicando que o teclado foi aberto
                const handleResize = () => {
                    const newViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                    if (newViewportHeight !== viewportHeight) {
                        adjustScrollPosition();
                    }
                };
    
                window.visualViewport?.addEventListener("resize", handleResize);
                adjustScrollPosition();
    
                return () => {
                    window.visualViewport?.removeEventListener("resize", handleResize);
                };
            }
        }, [searchDish]);
        
        return ( 
            <div className="relative sm w-full flex items-center">
                <IoSearchOutline className="absolute left-3 w-6 h-6 text-gray-500" />
                <input
                    className={cn(
                        "w-full pl-12 pr-10 py-2 h-12 focus:border-none focus:outline-none",
                        borderNone ? "" : "rounded-md border focus:ring-2 focus:ring-gray-300",
                        className
                    )}
                    value={searchDish}
                    onChange={handleSearchDish}
                    ref={inputRef}
                    {...props}
                
                />
                {!!searchDish.length && (
                    <TiDelete
                        onClick={() => setSearchDish("")}
                        className="absolute right-3 w-6 h-6 text-gray-400 cursor-pointer"
                    />
                )}
            </div>
        );
    }
)

InputSearch.displayName = "Input"

export { InputSearch }