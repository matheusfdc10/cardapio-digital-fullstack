import { getRestaurant } from "@/actions/admin/restaurant";
import List from "./list";
import SignOutButton from "./signout-button";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import RestaurantStatus from "./restaurant-status";

const Sidebar = async () => {
    const restaurant = await getRestaurant();

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

            <RestaurantStatus status={false}/>
            
            <div className="flex-1 flex flex-col justify-between">
                <List />
                <SignOutButton />
            </div>
        </aside>
    );
}
 
export default Sidebar;