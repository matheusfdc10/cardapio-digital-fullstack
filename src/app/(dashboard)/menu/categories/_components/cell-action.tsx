'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DishCategoryColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { toast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteDishCategory } from "@/actions/deleteDishCategory";

interface CellActionProps {
    data: DishCategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true)
            await deleteDishCategory(data.id);
            // toast({
            //     description: "Categoria excluida.",
            // });
            router.refresh();
            setOpen(false);
        } catch(error) {
            // toast({
            //     variant: "destructive",
            //     description: "Algo deu errado.",
            // });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AlertModal
                titile={`Exluir a categoria ${data.name}?`}
                description="Essa ação não pode ser desfeita."
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu aberto</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Ações
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/menu/categories/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Atualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}