import { getDishes } from "@/actions/admin/dish";


import ToastError from "@/components/toast-error";
import { DishClient } from "./_components/client";


const DishesPage = async () => {
    const response = await getDishes();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar pratos'
                toastMessage={response.error}
            />
        )
    }

    return (
        <DishClient data={response.data} />
    );
}
 
export default DishesPage;