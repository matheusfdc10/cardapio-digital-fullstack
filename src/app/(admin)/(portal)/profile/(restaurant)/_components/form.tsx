"use client"

import { createRestaurant, updateRestaurant } from "@/actions/admin/restaurant";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { RestaurantSchema } from "@/schemas/restaurant";
import { RestaurantType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = RestaurantSchema.omit({ id: true, updatedAt:true, createdAt: true, addressId: true });

export type RestaurantFormValues = z.infer<typeof formSchema>;

interface RestaurantFormPros {
    initialDate: RestaurantType | null
}

const RestaurantForm: React.FC<RestaurantFormPros> = ({
    initialDate
}) => {
    const router = useRouter();

    const action = initialDate ? 'Atualizar' : 'Criar';
    const title = initialDate ? "Atualizar Restaurante" : "Criar Restaurante";
    
    const form = useForm<RestaurantFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            logo: initialDate.logo || "",
            minimumOrderValue: initialDate.minimumOrderValue || 0,
        } : {
            name: "",
            email: "",
            logo: "",
            phone: "",
            whatsapp: "",
            minimumOrderValue: 0,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: RestaurantFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateRestaurant({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createRestaurant(data);
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
            }
            
        } catch(error) {
            toast({
                variant: "destructive",
                // title: "Algo deu errado.",
                description: "Algo deu errado.",
            });
        }
    }

    return (
        <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <Heading
                            title={title}
                        />
                        <FormField 
                            control={form.control}
                            name="logo"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                disabled={isLoading}
                                                placeholder="restaurante@exemplo.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>N° Telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="21 99999-9999"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>N° WhatsApp</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="21 99999-9999"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="minimumOrderValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pedido mínimo</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="R$ 20.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                          
                        </div>
                        <div className="flex justify-end pt-8">
                            <div className="flex flex-wrap gap-4 justify-end">
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
    );
}
 
export default RestaurantForm;