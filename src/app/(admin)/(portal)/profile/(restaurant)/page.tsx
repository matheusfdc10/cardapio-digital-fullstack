import { getRestaurant } from "@/actions/admin/restaurant";
import RestaurantForm from "./_components/form";
import ToastError from "@/components/toast-error";

const RestaurantPage = async () => {
    const response = await getRestaurant();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar restaurante'
                toastMessage={response.error}
            />
        )
    }

    return (
        <RestaurantForm initialDate={response.data}/>
    )
}
 
export default RestaurantPage;