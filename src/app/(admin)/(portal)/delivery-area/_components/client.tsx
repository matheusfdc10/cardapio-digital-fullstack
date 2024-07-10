"use client"

import MapArea from "@/components/map-area";
import { DataTable } from "@/components/ui/data-table";
import { AddressType, DeliveryAreaType } from "@/types";
import { columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/modals";
import FormComponent from "./form";
import { useState } from "react";

interface DeliveryAreaClientProps {
    data: DeliveryAreaType[]
}

const DeliveryAreaClient: React.FC<DeliveryAreaClientProps> = ({
    data,
}) => {
    const [modalState, setModalState] = useState(false)

    return (
        <>
            <Modal
                onClose={() => setModalState(false)}
                isOpen={modalState}
            >
                <FormComponent
                    initialDate={null}
                    onClose={() => setModalState(false)}
                />
            </Modal>
            <div className="flex items-center gap-2 justify-end mb-4">
                <Button 
                    onClick={() => setModalState(true)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Adicionar
                    </span>
                </Button>
            </div>
            <DataTable columns={columns} data={data}/>
        </>
    );
}
 
export default DeliveryAreaClient;