'use client'

import { createAdditionalCategory, deleteAdditionalCategory, updateAdditionalCategory } from "@/actions/admin/additional-category";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { AdditionalCategorySchema } from "@/schemas/additional-category";
import { AdditionalCategoryType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { getDishes } from "@/actions/admin/dish";

const formSchema = AdditionalCategorySchema.omit({ id: true, order:true, updatedAt:true, createdAt: true, description: true });

export type AdditionalCategoryFormValues = z.infer<typeof formSchema>;

interface FormModalProps {
    initialDate: AdditionalCategoryType | null;
    onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
    initialDate,
    onClose,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [dishes, setDishes] = useState<{ value: string, label: string}[]>([])
    const [additionals, setAdditionals] = useState<{ value: string, label: string}[]>([])
    const [isPending, startTransition] = useTransition();
    
    const action = initialDate ? "Salvar alterações" : "Adicionar";
    
    const form = useForm<AdditionalCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate || {
            name: "",
            status: false,
            isRequired: false,
            maxItems: 0,
            dishIds: [],
            additionalIds: []
        },
    })

    const isLoading = isPending || form.formState.isSubmitting;

    const onSubmit = async (data: AdditionalCategoryFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateAdditionalCategory({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createAdditionalCategory(data);
            }

            if (response.error) {
                toast({
                    variant: 'destructive',
                    description: response.error,
                });
            }

            if (response.success) {
                toast({
                    description: response.success,
                });

                router.refresh()
                onClose()
            }
            
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
            const response = await deleteAdditionalCategory(initialDate.id);

            if (response.error) {
                toast({
                    variant: "destructive",
                    description: response.error,
                });
            }

            if (response.success) {
                toast({
                    description: response.success,
                });

                router.refresh();
                onClose();
            }

            setOpen(false)
        } catch(error) {
            toast({
                variant: "destructive",
                description: "Algo deu errado.",
            });
        }
    }

    useEffect(() => {
        startTransition(() => {
            getDishes()
                .then(response => {
                    if (response.error) {
                        toast({
                            variant: "destructive",
                            description: response.error,
                        })
                    }
    
                    if (response.success) {
                        setDishes(response.data.map((item => ({
                            label: item.name,
                            value: item.id
                        }))))
                    }
                })

        })
    }, [])

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
                        className="space-y-4 w-full"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Nome do prato"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="maxItems"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maxímo de adicionais</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="isRequired"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>É obrigatório</FormLabel>
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
                                                    {field.value ? 'sim' : 'Não'}
                                                </Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        </div>
                        <FormField 
                            control={form.control}
                            name="dishIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pratos</FormLabel>
                                    <Select
                                        value={dishes.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione pratos"
                                        options={dishes}
                                        isMulti
                                        isDisabled={isLoading}
                                        closeMenuOnSelect={false}
                                        classNames={{
                                            
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="additionalIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adicionais</FormLabel>
                                    <Select
                                        value={additionals.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione pratos"
                                        options={additionals}
                                        isMulti
                                        isDisabled={isLoading}
                                        closeMenuOnSelect={false}
                                        classNames={{
                                            
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-8">
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