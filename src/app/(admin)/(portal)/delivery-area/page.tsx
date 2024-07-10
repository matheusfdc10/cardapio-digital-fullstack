import ToastError from "@/components/toast-error";
import DeliveryAreaClient from "./_components/client";
import { getDeliveryAreas } from "@/actions/admin/delivery-area";
import { getAddress } from "@/actions/admin/address";

const DeliveryAreaPage = async () => {
    const response = await getDeliveryAreas();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar areas de entrega'
                toastMessage={response.error}
            />
        )
    }

    return (
        <DeliveryAreaClient
            data={response.data}
        />
    )
}
export default DeliveryAreaPage;