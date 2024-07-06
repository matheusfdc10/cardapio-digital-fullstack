"use client"

import { RxHome } from "react-icons/rx";
import { GoClock } from "react-icons/go";
import { PiNotepad } from "react-icons/pi";
import { GrMap } from "react-icons/gr";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdRestaurantMenu, MdStorefront } from "react-icons/md";
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
        text: "Pedidos",
        textHint: "Pedidos",
        link: "/home",
        icon: PiNotepad ,
    },
    {
        text: "Cardápio",
        textHint: "Cardápio",
        link: "/menu/categories",
        icon: IoRestaurantOutline,
    },
    {
        text: "Horários",
        textHint: "Horários",
        link: "/schedules",
        icon: GoClock,
    },
    {
        text: "Área de entrega",
        textHint: "Área de entrega",
        link: "/delivery-area",
        icon: GrMap,
    },
    {
        text: "Formas de pagamentos",
        textHint: "Formas de pagamentos",
        link: "/home",
        icon: HiOutlineCreditCard,
    },
    {
        text: "Perfil",
        textHint: "Perfil",
        link: "/profile",
        icon: MdStorefront,
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