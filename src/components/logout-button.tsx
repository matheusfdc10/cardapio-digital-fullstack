"use client";

import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    children?: React.ReactNode;
    redirectUrl?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    children,
    redirectUrl
}) => {
    const router = useRouter()

    const onClick = () => {
        logout()
            .then((response) => {
                if (response?.success) {
                    router.push(redirectUrl || "/")
                }
            })
    }
    
    return (
        <span onClick={onClick} className="cursor-pointer w-full">
            {children}
        </span>
    )
}