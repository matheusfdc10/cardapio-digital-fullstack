"use client"

import Hint from "@/components/hint";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconType } from "react-icons/lib";

interface ItemProps {
    text: string;
    textHint: string;
    link: string;
    icon: IconType;
    isActive: boolean;
}

const Item: React.FC<ItemProps> = ({
    text,
    textHint,
    link,
    isActive,
    icon: Icon
}) => {
    return (
        <li className="flex">
            <Hint
                label={textHint}
                side="right"
                align="start"
                sideOffset={12}
            >
                <Link
                    className={cn(
                        "w-full flex items-center justify-center sm:justify-start gap-3 hover:text-red-500 hover:bg-zinc-200/50 hover:font-semibold p-2 transition text-lg",
                        isActive ? "bg-zinc-200/50 text-red-500 font-semibold" : ""
                    )}
                    href={link}
                >
                    <Icon className="w-6 h-6 sm:w-5 sm:h-5 sm:ml-4"/>
                    <span className="hidden sm:block">
                        {text}
                    </span>
                </Link>
            </Hint>
        </li>
    );
}
 
export default Item;