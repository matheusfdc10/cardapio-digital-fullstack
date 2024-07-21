import { getRestaurant } from "@/actions/user/restaurant";
import { auth, signOut } from "@/auth";
// import { useSession } from "next-auth/react";
// import { useContext } from "react";
// import { RestaurantContext } from "@/contexts/restaurant-context";
import { Header } from "./_components/header";
import { getMenu } from "@/actions/user/menu";
import { Menu } from "./_components/menu";
import { Footer } from "./_components/footer";
import FilterSection from "./_components/filter-section";
import { TabBar } from "./_components/tab-bar";
import { InputSearch } from "./_components/input-search";

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
        <div className="mx-6 sm:mx-8 my-6 max-w-sm hidden sm:block">
          <InputSearch placeholder="Buscar por um item"/>
        </div>
        <Menu data={menu.data}/>
      </main>
      <Footer />
      <TabBar />
    </>
  );
}
 
export default MenuPage;
