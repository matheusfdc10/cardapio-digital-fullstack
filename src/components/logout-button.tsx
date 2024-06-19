"use client";

import { logout } from "@/actions/auth";

interface LogoutButtonProps {
    children?: React.ReactNode;
    redirectUrl?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    children,
    redirectUrl
}) => {
    const onClick = () => {
        logout(redirectUrl)
    }
    
    return (
        <span onClick={onClick} className="cursor-pointer w-full">
            {children}
        </span>
    )
}