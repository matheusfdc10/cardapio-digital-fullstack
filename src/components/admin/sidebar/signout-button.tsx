import Hint from "@/components/hint";
import { LogoutButton } from "@/components/logout-button";
import { RxExit } from "react-icons/rx";

const SignOutButton = () => {
    return (
        <LogoutButton
            redirectUrl="/auth/login"
        >
            <Hint
                label="Sair"
                side="right"
                align="start"
                sideOffset={12}
            >
                <div
                    className="w-full flex items-center justify-center sm:justify-start gap-3 hover:text-red-500 hover:bg-zinc-200/50 hover:font-semibold p-2 transition"
                >
                    <RxExit className="w-6 h-6 sm:w-5 sm:h-5 sm:ml-3"/>
                    <span className="hidden sm:block">
                        Sair
                    </span>
                </div>
            </Hint>
        </LogoutButton>
    );
}
 
export default SignOutButton;