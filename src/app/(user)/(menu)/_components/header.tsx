import { FaUser } from "react-icons/fa";
import { RestaurantType } from "@/types";
import Image from "next/image";
import { cn, isOpenToday } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"
import { CartButton } from "./cart-button";

interface HeaderProps {
    restaurant: RestaurantType;
}

export const Header: React.FC<HeaderProps> = ({
    restaurant
}) => {

    const openToday = isOpenToday(restaurant.openingHours || [])

    return (
        <header className="flex justify-between h-28 sm:h-36 px-6 sm:px-8 py-5 border-b">
            <div className="flex justify-center items-center gap-4">
                <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-lg border overflow-hidden">
                    <Image
                        src={restaurant.logo!}
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col whitespace-nowrap sm:space-y-1">
                    <h1 className="font-bold text-xl sm:text-2xl">
                        {restaurant.name}
                    </h1>
                    
                    <span className="text-xs sm:text-sm font-medium">
                        {restaurant.address?.neighborhood}, {restaurant.address?.city}
                    </span>

                    <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            openToday.status ? "bg-green-500" : "bg-red-500"
                        )} />
                        {openToday.status ? (
                            `Aberto até ${openToday.hour}`
                        ) : (
                            `Abre ${openToday.dayOfWeek} às ${openToday.hour}`
                        )}
                    </span>
                </div>
            </div>

            <div className="hidden sm:block">
                <div className="flex gap-6 mt-6 mr-5">
                    <div className="relative cursor-pointer sm:hover:scale-[1.03] sm:active:scale-100">
                    <FaUser className="w-6 h-6"/>
                    </div>

                    <CartButton />
                </div>
            </div>
      </header>
    );
}
 
export function SkeletonHeader() {
  return (
    <>
        <header className="flex justify-between h-28 sm:h-36 px-6 sm:px-8 py-5 border-b">
            <div className="flex justify-center items-center gap-4">
                <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-lg border overflow-hidden">
                    <Skeleton className="object-contain" />
                </div>
                <div className="flex flex-col whitespace-nowrap sm:space-y-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
            </div>

            <div className="hidden sm:block">
                <div className="flex gap-6 mt-6 mr-5">
                    <Skeleton className="h-4 w-[250px]" />

                    <Skeleton className="h-4 w-[250px]" />
                </div>
            </div>
      </header>
    </>
  )
}