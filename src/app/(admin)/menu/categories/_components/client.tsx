"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading"; 
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useState, useTransition } from "react";
import { updateManyDishCategories } from "@/actions/admin/dish-category";
import FormModal from "./form-modal";
import { DishCategoryType, DishType } from "@/types";
import Modal from "@/components/modals";
import { toast } from "@/components/ui/use-toast";
import Reorder, { ReorderType } from "@/components/reorder";

interface DishCategoriesClient extends DishCategoryType {
    dishes: DishType[]
}

interface DishCategoriesClientProps {
    data: DishCategoriesClient[]
}

export const DishCategoriesClient: React.FC<DishCategoriesClientProps> = ({
    data
}) => {
    const [isPending, startTransition] = useTransition();
    const [openReorder, setOpenReorder] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const router = useRouter();
    
    const handleSetReoder = (data: ReorderType[]) => {
        startTransition(async () => {
            try {
                const response = await updateManyDishCategories(data)
                
                toast({
                    description: "Ordem atualizada.",
                });

                router.refresh();
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
                title="Nova categoria"
                description="Adicionar uma nova categoria"
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
                    title={`Categorias de pratos`}
                    description="Gerencie suas categorias de pratos"
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
