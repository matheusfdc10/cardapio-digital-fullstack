import { getDishes } from "@/actions/admin/dish";


import ToastError from "@/components/toast-error";
// import { DishClient } from "./_components/client";


const AdditionalsPage = async () => {
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
        <div>Addicionis</div>
        // <DishClient data={response.data} />
    );
}
 
export default AdditionalsPage;