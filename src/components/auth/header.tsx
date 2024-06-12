import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

interface HeaderProps {
    title: string;
    description?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    description
}) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold",
                font.className
            )}>
                {title}
            </h1>
            {description && (
                <p className="text-muted-foreground text-sm">
                    {description}
                </p>
            )}
        </div>
    );
}