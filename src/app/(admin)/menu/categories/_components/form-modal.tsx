'use client'

import { createDishCategory, deleteDishCategory, updateDishCategory } from "@/actions/admin/dish-category";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { DishCategorySchema } from "@/schemas";
import { DishCategoryType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = DishCategorySchema.omit({ id: true, order:true, dishes:true, updatedAt:true, createdAt: true, description: true });

export type DishCategoryFormValues = z.infer<typeof formSchema>;

interface FormModalProps {
    initialDate: DishCategoryType | null;
    onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
    initialDate,
    onClose,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    
    const action = initialDate ? "Salvar alterações" : "Adicionar";
    
    const form = useForm<DishCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate || {
            name: "",
            status: false,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: DishCategoryFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateDishCategory({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createDishCategory(data);
            }

            if (response.success) {
                toast({
                    description: response.success,
                });
            }

            if (response.error) {
                toast({
                    variant: 'destructive',
                    description: response.error,
                });
            }

            router.refresh()
            onClose()
        } catch(error) {
            toast({
                variant: "destructive",
                // title: "Algo deu errado.",
                description: "Algo deu errado.",
            });
        }
    }

    const onDelete = async () => {
        if (!initialDate?.id) return
        try {
            await deleteDishCategory(initialDate.id)
            toast({
                description: "Categoria deletada",
            });
            router.refresh();
            setOpen(false)
            onClose();
        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }

    return (
        <>
            <AlertModal
                titile={`Excluir a categoria ${initialDate?.name}?`}
                description="Essa ação não pode ser desfeita"
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            <div className="space-y-4">
                {/* <Separator /> */}
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Nome da categoria"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {initialDate && (
                            <FormField 
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-6 pt-2">
                                                <Switch
                                                    disabled={isLoading}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <Label className={cn(
                                                    "rounded-2xl text-white font-medium py-1 px-3 transition",
                                                    field.value ? "bg-emerald-500" : "bg-red-500"
                                                )}>
                                                    {field.value ? 'Ativo' : 'Inativo'}
                                                </Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="flex justify-end pt-4">
                            <div className="flex flex-wrap gap-4 justify-end">
                                {initialDate && (
                                    <Button
                                        type="button"
                                        disabled={isLoading}
                                        variant="destructive"
                                        onClick={() => setOpen(true)}
                                    >
                                        Excluir
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {action}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}
 
export default FormModal;