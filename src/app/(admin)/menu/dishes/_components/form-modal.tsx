'use client'

import { createDish, deleteDish, updateDish } from "@/actions/admin/dish";
import ImageUpload from "@/components/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { DishSchema } from "@/schemas/dish";
import { DishType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectMult from "react-select";
import { getDishCategories } from "@/actions/admin/dish-category";

const formSchema = DishSchema.omit({ id: true, updatedAt:true, createdAt: true });

export type DishFormValues = z.infer<typeof formSchema>;

interface FormModalProps {
    initialDate: DishType | null;
    onClose: () => void;
    // categories: { value: string, label: string}[];
}

const FormModal: React.FC<FormModalProps> = ({
    initialDate,
    onClose,
    // categories
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<{ value: string, label: string}[]>([])
    const [additionalCategories, setAdditionalCategories] = useState<{ value: string, label: string}[]>([])
    
    const action = initialDate ? "Salvar alterações" : "Adicionar";
    
    const form = useForm<DishFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            description: initialDate?.description || "",
            image: initialDate.image || "",
            price: parseFloat(String(initialDate.price))
        } : {
            name: "",
            description: "",
            image: "",
            price: 0,
            status: false,
            categoryId: "",
            additionalCategoryIds: [],
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: DishFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateDish({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createDish(data);
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
            const response = await deleteDish(initialDate.id);

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
        getDishCategories()
            .then(response => {
                if (response.error) {
                    toast({
                        variant: "destructive",
                        description: response.error,
                    })
                }

                if (response.success) {
                    setCategories(response.data.map((category => ({
                        label: category.name,
                        value: category.id
                    }))))
                }
            })
    }, [])

    return (
        <>
            <AlertModal
                titile={`Excluir o prato ${initialDate?.name}?`}
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
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <SelectMult
                                        value={categories.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            field.onChange(selectedOptions?.value);
                                        }}
                                        placeholder="Selecione categoria"
                                        options={categories}
                                        isDisabled={isLoading}
                                        classNames={{
                                            
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <FormField 
                            control={form.control}
                            name="additionalCategoryIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria de adicionais</FormLabel>
                                    <SelectMult
                                        value={additionalCategories.filter((item) => field.value.includes(item.value))}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.map((option) => option.value);
                                            field.onChange(selectedValues);
                                        }}
                                        placeholder="Selecione adicionais"
                                        options={additionalCategories}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder="Descrição do prato"
                                            {...field}
                                        />
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
                        <FormField 
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="pt-2">
                                    {/* <FormLabel>Imagem</FormLabel> */}
                                    <FormControl>
                                        <ImageUpload 
                                            value={field.value ? [field?.value] : []}
                                            disabled={isLoading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={(url) => field.onChange("")}
                                            amount={1}
                                        />
                                    </FormControl>
                                    <FormMessage />
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