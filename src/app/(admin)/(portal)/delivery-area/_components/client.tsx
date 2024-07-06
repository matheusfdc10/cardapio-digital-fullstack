"use client"

import MapArea from "@/components/map-area";

interface DeliveryAreaClientProps {
    lat: number;
    lng: number;
    distance: number; // distance in kilometers
    name: string;
}

const DeliveryAreaClient: React.FC<DeliveryAreaClientProps> = ({
    distance,
    lat,
    lng,
    name
}) => {

    return (
        <div>
            <MapArea
                distance={distance}
                lat={lat}
                lng={lng}
                name={name}
            />
        </div>
    );
}
 
export default DeliveryAreaClient;