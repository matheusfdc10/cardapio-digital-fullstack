"use client"

import Modal from "@/components/modals";
import { OpeningHoursType } from "@/types";
import OpeningHoursForm from "./form";
import { useState } from "react";

interface EventItemProps {
    data: OpeningHoursType
    top: number;
    height: number;
    opensAt: string;
    closesAt: string;
}

const EventItem: React.FC<EventItemProps> = ({
    data,
    top,
    height,
    opensAt,
    closesAt,
}) => {
    const [stateModal, setStateModal] = useState(false)
    return (
        <>
            <Modal
                title="Atualizar horário"
                onClose={() => setStateModal(false)}
                isOpen={stateModal}
            >
                <OpeningHoursForm
                    initialDate={data}
                    onClose={() => setStateModal(false)}
                />
            </Modal>
            <div
                onClick={() => setStateModal(true)}
                className="absolute left-1 right-1 bg-green-400/30 hover:bg-green-500/30 text-green-600 text-center text-sm font-medium p-1 shadow-sm flex flex-col justify-center hover:z-10 cursor-pointer"
                style={{ top, height }}
            >
                <span>De {opensAt}</span>
                <span>às {closesAt}</span>
            </div>
        </>
    );
}
 
export default EventItem;