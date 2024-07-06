import { getRestaurant } from "@/actions/admin/restaurant";
import DeliveryAreaClient from "./_components/client";

const DeliveryAreaPage = async () => {
    const response = await getRestaurant()

    return (
        <DeliveryAreaClient
            distance={3}
            lat={Number(response.data?.address?.latitude)}
            lng={Number(response.data?.address?.longitude)}
            name={response.data?.name || 'Restaurant'}
        />
    )
}
export default DeliveryAreaPage;