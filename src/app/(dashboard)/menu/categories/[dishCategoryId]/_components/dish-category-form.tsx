"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { DishCategory } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createDishCategory } from "@/actions/createDishCategory";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Informe uma categoria"
    }),
    status: z.boolean().default(true),
})

export type DishCategoryFormValues = z.infer<typeof formSchema>;

interface DishCategoryFormProps {
    initialDate: DishCategory | null;
}

const DishCategoryForm: React.FC<DishCategoryFormProps> = ({
    initialDate
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const title = initialDate ? "Editar categoria" : "Nova categoria";
    const description = initialDate ? "Editar uma categoria" : "Adicionar uma nova categoria";
    const toastMessage = initialDate ? "Categoria atualizada." : "Categoria criada.";
    const action = initialDate ? "Salvar alterações" : "Adicionar";

    const form = useForm<DishCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate || {
            name: "",
            status: true,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: DishCategoryFormValues) => {
        try {
            if (initialDate) {
                // await axios.patch(`/api/category/${initialDate.id}`, data);
            } else {
                await createDishCategory(data);
            }

            // router.refresh();
            // toast({
            //     description: toastMessage,
            // });
            router.push(`/menu/categories`);

        } catch(error) {
            // toast({
            //     variant: "destructive",
            //     // title: "Email ou senha inválido!",
            //     description: "Algo deu errado.",
            // });
        }
    }

    const onDelete = async () => {
        // try {
        //     await axios.delete(`/api/category/${initialDate?.id}`);
        //     router.refresh();
        //     toast({
        //         description: "Categoria deletada",
        //     });
        //     router.push(`/categories`);
        // } catch(error) {
        //     toast({
        //         variant: "destructive",
        //         // title: "Email ou senha inválido!",
        //         description: "Algo deu errado.",
        //     });
        // }
    }

    const handleCancel = () => {
        router.back();
    }

    return (
        <div className="space-y-4 pt-2">
            <AlertModal
                titile={`Tem certeza em excluir a categoria ${initialDate?.name}?`}
                description="Essa ação não pode ser desfeita"
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            {/* <Separator /> */}
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialDate && (
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {/* <Separator /> */}
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
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
                                            <Label className={field.value ? "text-green-500" : "text-red-500"}>
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
                        <div className="space-x-4">
                            <Button
                                variant="destructive"
                                type="button"
                                disabled={isLoading}
                                className="ml-auto"
                                onClick={handleCancel}
                            >
                                Voltar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="ml-auto"
                            >
                                {action}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default DishCategoryForm