import { DishCategoriesClient } from "./_components/client";
import { DishCategoryColumn } from "./_components/columns";
import { format } from "date-fns";
import getDishCategories from "@/actions/getDishCategories";

export const revalidate = false;

const DishCategoriesPage = async () => {
    const dishCategories = await getDishCategories();

    const formattedDishCategories: DishCategoryColumn[] = dishCategories.map((item) => ({
        id: item.id,
        name: item.name,
        qtdPratos: item.dishes.length.toString(),
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        status: item.status,
        order: item.order,
    }))

    return (
        <DishCategoriesClient data={formattedDishCategories} />
    );
}
 
export default DishCategoriesPage;