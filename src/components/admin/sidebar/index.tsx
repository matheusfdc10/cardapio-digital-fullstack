import { getRestaurant } from "@/actions/admin/restaurant";
import List from "./list";
import SignOutButton from "./signout-button";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import RestaurantStatus from "./restaurant-status";
import { OpeningHoursType } from "@/types";

const Sidebar = async () => {
    const restaurant = await getRestaurant();
    
    const isOpenNow = (openingHours: OpeningHoursType[] | null): boolean | null => {
        if (!openingHours) return null
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
    
        const parseTimeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
    
        return openingHours.some(openingHours => {
            if (openingHours.dayOfWeek !== currentDay) return false;
    
            const opensAtMinutes = parseTimeToMinutes(openingHours.opensAt);
            const closesAtMinutes = parseTimeToMinutes(openingHours.closesAt);
    
            return opensAtMinutes <= currentTime && currentTime < closesAtMinutes;
        });
    };

    return (
        <aside className="fixed z-[1] left-0 h-full w-14 sm:w-64 flex py-3 flex-col gap-y-3 bg-zinc-100 overflow-y-auto">
            <div className={cn(
                restaurant.data ? "hidden sm:block" : "hidden",
            )}>
                <div className="flex justify-center items-center mx-3">
                    {restaurant.data?.logo ? (
                        <Logo src={restaurant.data.logo} />
                    ) : (
                        <h1 className="text-lg font-semibold text-center">
                            {restaurant.data?.name}
                        </h1>
                    )}
                </div>
            </div>

            <RestaurantStatus status={isOpenNow(restaurant.data?.openingHours || null)}/>
            
            <div className="flex-1 flex flex-col justify-between">
                <List />
                <SignOutButton />
            </div>
        </aside>
    );
}
 
export default Sidebar;