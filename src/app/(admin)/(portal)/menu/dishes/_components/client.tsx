"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading"; 
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { useState } from "react";
import FormModal from "./form-modal";
import { DishType } from "@/types";
import Modal from "@/components/modals";

interface DishClientProps {
    data: DishType[]
}

export const DishClient: React.FC<DishClientProps> = ({
    data
}) => {
    const [openForm, setOpenForm] = useState(false);

    return (
        <>
            <Modal
                title="Novo Prato"
                description="Adicionar um novo prato"
                onClose={() => setOpenForm(false)}
                isOpen={openForm}
                maxWidth={800}
            >
                <FormModal
                    initialDate={null}
                    onClose={() => setOpenForm(false)}
                />
            </Modal>
            
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Pratos`}
                    description="Gerencie seus pratos"
                />
                <Button 
                    onClick={() => setOpenForm(true)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Novo prato
                    </span>
                </Button>
            </div>
            <DataTable searchKey="name" columns={columns} data={data}/>
        </>
    )
}
