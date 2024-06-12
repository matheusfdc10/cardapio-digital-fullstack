"use client"

import { RxHome } from "react-icons/rx";
import { MdRestaurantMenu } from "react-icons/md";
import { usePathname } from "next/navigation";
import Item from "./item";

const itens = [
    {
        text: "Início",
        textHint: "Início",
        link: "/home",
        icon: RxHome ,
    },
    {
        text: "Cardápio",
        textHint: "Cardápio",
        link: "/menu/categories",
        icon: MdRestaurantMenu,
    },
]


const List = () => {
    const params = usePathname();
    const link = params.split("/")[1];

    return (
        <ol className="space-y-1 transition">
            {itens.map((item, key) => (
                <Item
                    key={key}
                    text={item.text}
                    textHint={item.textHint}
                    link={item.link}
                    icon={item.icon}
                    isActive={link == item.link.split("/")[1]}
                />
            ))}
        </ol>
    );
}
 
export default List;