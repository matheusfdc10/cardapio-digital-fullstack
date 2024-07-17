import { getRestaurant } from "@/actions/admin/restaurant";
import { RestaurantProvider } from "@/contexts/restaurant-context";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = async ({
    children
}) => {
    // const restaurant = await getRestaurant()

    // if(restaurant.data === null) {
    //     return <div>Restaurant not found</div>
    // }
    
    return (
        <div className="max-w-screen-2xl min-h-screen mx-auto flex flex-col">
            {/* <RestaurantProvider restaurant={restaurant.data}> */}
                {children}
            {/* </RestaurantProvider> */}
        </div>
    );
}
 
export default AdminLayout;