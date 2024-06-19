import { toast } from "@/components/ui/use-toast";
import { DishCategoriesClient } from "./_components/client";
import { getDishCategories } from "@/actions/admin/dish-category";
import { redirect } from "next/navigation";
import ToastError from "@/components/toast-error";

export const revalidate = 0;

const DishCategoriesPage = async () => {
    const response = await getDishCategories();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar categorias de pratos'
                toastMessage={response.error}
            />
        )
    }

    return (
        <DishCategoriesClient data={response.data} />
    );
}
 
export default DishCategoriesPage;