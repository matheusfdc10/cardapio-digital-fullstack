"use client"

import { LogoutButton } from "@/components/logout-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

interface UserProps {
    isMobile?: boolean
}

const User = ({
    isMobile
}: UserProps) => {
    const { data } = useSession()

    return (
        <Popover>
            <PopoverTrigger asChild>
                {isMobile ? (
                    <button className="flex flex-col justify-center gap-1 items-center w-full py-2 cursor-pointer">
                        <FaRegUser className="w-6 h-6" />
                        <span className="font-semibold text-xs">
                            Perfil
                        </span>
                    </button>
                ) : (
                    <button className="relative cursor-pointer sm:hover:scale-[1.03] sm:active:scale-100">
                        <FaUser className="w-6 h-6"/>
                    </button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto">
                {data?.user ? (
                    <ul className="max-h-[calc(100dvh-200px)] overflow-y-auto flex flex-col w-32">
                        <li className="text-lg font-medium cursor-pointer hover:text-red-400 py-1">
                            Pedidos
                        </li> 
                        <li className="text-lg font-medium cursor-pointer hover:text-red-400 py-1">
                            Meus dados
                        </li>
                        <li className="text-lg font-medium cursor-pointer hover:text-red-400 py-1">
                            <LogoutButton textAlign="text-start" redirectUrl="/">
                                Sair
                            </LogoutButton>
                        </li>
                    </ul>            
                ) : (
                    <Link href="/auth/login" className="text-lg font-medium cursor-pointer hover:text-red-400 w-full">
                        Entrar
                    </Link>
                )}
            </PopoverContent>
        </Popover>
    );
}
 
export default User;