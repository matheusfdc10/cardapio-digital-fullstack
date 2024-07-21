import { getRestaurant } from "@/actions/admin/restaurant";
import { MenuProvider } from "@/contexts/menu";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = async ({
    children
}) => {
    const restaurant = await getRestaurant()

    if(restaurant.data === null) {
        return <div>Restaurant not found</div>
    }
    
    return (
        <div className="max-w-screen-2xl min-h-[100dvh] mx-auto flex flex-col">
            <MenuProvider restaurant={restaurant.data}>
                {children}
            </MenuProvider>
        </div>
    );
}
 
export default AdminLayout;