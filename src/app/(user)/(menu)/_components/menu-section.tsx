import { MenuType } from "@/types";

type MenuSectionProps = {
    data: MenuType;
    children: React.ReactNode;
}
export const MenuSection = ({
    data,
    children,
}: MenuSectionProps) => {
    return ( 
        <section
            id={data.name}
            className="pb-8 space-y-4 transition"
        >
            <div className="flex gap-2 sm:gap-3 items-center">
                <div className="py-2 px-3 bg-red-500">
                    <span className="font-black text-sm sm:text-base text-white">
                    |
                    </span>
                </div>

                <h1 className="font-bold text-xl sm:text-2xl leading-6">
                    {data.name}
                </h1>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {children}
            </ul>
        </section>
    );
}