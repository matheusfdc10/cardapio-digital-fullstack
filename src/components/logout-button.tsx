
import { logout } from "@/actions/auth";

interface LogoutButtonProps {
    children?: React.ReactNode;
    redirectUrl?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    children,
    redirectUrl = '/auth/login'
}) => {
    const handleAction = logout.bind(null, redirectUrl)
    
    return (
        <form
            action={handleAction}
            className="w-full"
        >
            <button 
                type="submit"
                className="w-full"
            >
                {children || 'Sair'}
            </button>
        </form>
    )
}