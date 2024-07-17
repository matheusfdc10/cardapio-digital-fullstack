import { getRestaurant } from "@/actions/user/restaurant";
import { auth, signOut } from "@/auth";
// import { useSession } from "next-auth/react";
// import { useContext } from "react";
// import { RestaurantContext } from "@/contexts/restaurant-context";
import { Header } from "./_components/header";
import { getMenu } from "@/actions/user/menu";
import Image from "@/components/image";
import { formatPrice } from "@/lib/utils";
import { Menu } from "./_components/menu";
import { Footer } from "./_components/footer";
import FilterSection from "./_components/filter-section";

const MenuPage = async () => {
  // const session = await auth();
  const [restaurant, menu] = await Promise.all([
    getRestaurant(),
    getMenu()
  ])

  if(restaurant.error || !menu.data) {
    return (
      <div>
        Algo deu errado
      </div>
    )
  }

  if(!restaurant.data) {
    return (
      <div>
        Restaurante não criado
      </div>
    )
  }

  return (
    <>
      <Header restaurant={restaurant.data} />
      <main className="flex-grow">
        <FilterSection menu={menu.data} />
        <Menu data={menu.data}/>
      </main>
      <Footer />
    </>
  );
}
 
export default MenuPage;
