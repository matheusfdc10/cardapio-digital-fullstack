'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertModal } from "@/components/modals/alert-modal";
import FormModal from "./form-modal";
import { DishType } from "@/types";
import Modal from "@/components/modals";
import { toast } from "@/components/ui/use-toast";
import { deleteDish } from "@/actions/admin/dish";

interface CellActionProps {
    data: DishType;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const onDelete = () => {
        startTransition(async () => {
            try {
                const response = await deleteDish(data.id);

                if (response.error) {
                    toast({
                        variant: "destructive",
                        description: response.error,
                    });
                }

                if (response.success || response.data) {
                    toast({
                        description: response.success,
                    });

                    router.refresh();
                    setOpen(false);
                }
            } catch(error) {
                toast({
                    variant: "destructive",
                    description: "Algo deu errado.",
                });
            }
        })
    }

    return (
        <>
            <AlertModal
                titile={`Exluir prato ${data.name}?`}
                description="Essa ação não pode ser desfeita."
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isPending}
            />
            <Modal
                title="Editar prato"
                // description="Editar uma prato"
                maxWidth={800}
                onClose={() => setOpenForm(false)}
                isOpen={openForm}
            >
                <FormModal
                    initialDate={data}
                    onClose={() => setOpenForm(false)}
                />
            </Modal>
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
                    <DropdownMenuItem onClick={() => setOpenForm(true)}>
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