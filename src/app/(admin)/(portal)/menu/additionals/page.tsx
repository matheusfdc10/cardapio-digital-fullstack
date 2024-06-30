import { getAdditionals } from "@/actions/admin/additional";
import ToastError from "@/components/toast-error";
import { AdditionalClient } from "./_components/client";


const AdditionalsPage = async () => {
    const response = await getAdditionals();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar adicionais'
                toastMessage={response.error}
            />
        )
    }

    return (
        <AdditionalClient data={response.data} />
    );
}
 
export default AdditionalsPage;