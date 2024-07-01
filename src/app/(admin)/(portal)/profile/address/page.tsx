import { getAddress } from "@/actions/admin/address";
import FormAddress from "./_components/form";
import ToastError from "@/components/toast-error";

const AddressPage = async () => {
    const response = await getAddress()

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar restaurante'
                toastMessage={response.error}
            />
        )
    }

    return (
        <FormAddress initialDate={response.data} />
    )
}
 
export default AddressPage;