"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading"; 
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DishCategoryColumn, columns } from "./columns";
import { useState } from "react";
import { ReoderModal, ReoderType } from "@/components/modals/reoder-modal";
import { updateManyDishCategories } from "@/actions/updateManyDishCategories";
import { DishCategoryType } from "@/data/dishCategory";
// import { ReoderModal, ReoderType } from "@/components/modals/ReoderModal";
// import axios from "axios";
// import { toast } from "@/components/ui/use-toast";

interface DishCategoriesClientProps {
    data: DishCategoryColumn[];
}

export const DishCategoriesClient: React.FC<DishCategoriesClientProps> = ({
    data
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSetReoder = async (data: ReoderType[]) => {
        try {
            setLoading(true);
            const dataFormat: DishCategoryType[] = data.map((item) => {
                return {
                    id: item.id,
                    order: item.order,
                };
            });
            await updateManyDishCategories(dataFormat)
            // toast({
            //     description: "Ordem atualizada.",
            // });
            router.refresh();
        } catch(error) {
            // toast({
            //     variant: "destructive",
            //     description: "Algo deu errado.",
            // });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            {open && (
                <ReoderModal 
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onConfirm={handleSetReoder}
                    loading={loading}
                    initialData={data}
                />
            )}
            <div className="flex items-center gap-2 justify-between">
                <Heading
                    title={`Categorias de pratos`}
                    description="Gerencie suas categorias de pratos"
                />
                <Button 
                    onClick={() => router.push(`/menu/categories/new`)}
                    className="flex gap-2"
                >
                    <Plus className="h-4 w-4"/>
                    <span className="hidden sm:block">
                        Nova Categoria
                    </span>
                </Button>
            </div>
            {/* <Separator /> */}
            <DataTable searchKey="name" columns={columns} data={data} onClickReorder={() => setOpen(true)}/>
        </>
    )
}
