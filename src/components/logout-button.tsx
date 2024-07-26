"use client"
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    children?: React.ReactNode;
    redirectUrl?: string;
    textAlign?: "text-start"| "text-center" | "text-end";
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    children,
    redirectUrl = '/auth/login',
    textAlign = 'text-center'
}) => {
    // const handleAction = logout.bind(null, redirectUrl)
    
    
    const onClick = async () => {
        // logout()
        await signOut()
    }

    return (
        <>
            <span 
                onClick={onClick} 
                className={cn(
                    "w-full cursor-pointer",
                    textAlign,
                )}    
            >
                {children || 'Sair'}
            </span>
            {/* <form
                action={handleAction}
                className="w-full"
            >
                <button 
                    type="submit"
                    className={cn(
                        "w-full",
                        textAlign,
                    )}
                >
                    {children || 'Sair'}
                </button>
            </form> */}
        </>
    )
}