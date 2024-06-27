"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading"; 
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useState, useTransition } from "react";
import { updateManyAdditionalCategories } from "@/actions/admin/additional-category";
import FormModal from "./form-modal";
import { AdditionalCategoryType } from "@/types";
import Modal from "@/components/modals";
import { toast } from "@/components/ui/use-toast";
import Reorder, { ReorderType } from "@/components/reorder";

interface AdditionalCategoriesClientProps {
    data: AdditionalCategoryType[]
}

export const AdditionalCategoriesClient: React.FC<AdditionalCategoriesClientProps> = ({
    data
}) => {
    const [isPending, startTransition] = useTransition();
    const [openReorder, setOpenReorder] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const router = useRouter();
    
    const handleSetReoder = (data: ReorderType[]) => {
        startTransition(async () => {
            try {

                const response = await updateManyAdditionalCategories(data.map((item) => ({
                    id: item.id,
                    order: item.order
                })))

                if (response.error) {
                    toast({
                        variant: "destructive",
                        description: response.error,
                    });
                }

                if (response.success && response.data) {
                    toast({
                        description: response.success,
                    });
                    
                    router.refresh();
                }
            } catch(error) {
                toast({
                    variant: "destructive",
                    description: "Algo deu errado.",
                });
            } finally {
                setOpenReorder(false);
            }
        })
    }

    return (
        <>
            <Modal
                title="Reordenar"
                onClose={() => setOpenReorder(false)}
                isOpen={openReorder}
                maxWidth={800}
            >
                <Reorder 
                    onConfirm={handleSetReoder}
                    loading={isPending}
                    initialData={data}
                />
            </Modal>
            
            <Modal
                title="Nova categoria de adicionais"
                description="Adicionar uma nova categoria de adicionais"
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
                    title={`Categorias de adicionais`}
                    description="Gerencie suas categorias de adicionais"
                />
                <Button 
                    onClick={() => setOpenForm(true)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Nova Categoria
                    </span>
                </Button>
            </div>
            <DataTable searchKey="name" columns={columns} data={data} onClickReorder={() => setOpenReorder(true)}/>
        </>
    )
}
