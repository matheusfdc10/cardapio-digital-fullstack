"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddressSchema } from "@/schemas/address";
import { AddressType } from "@/types";
import { z } from "zod";
import SearchAddress from "@/components/search-address";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAddress, updateAddress } from "@/actions/admin/address";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";

const formSchema = AddressSchema.omit({ id: true, updatedAt:true, createdAt: true, addressId: true, userId: true });

export type AddressFormValues = z.infer<typeof formSchema>;

interface AddressFormPros {
    initialDate: AddressType | null
}

const FormAddress: React.FC<AddressFormPros> = ({
    initialDate
}) => {
    const router = useRouter();

    const action = initialDate ? 'Atualizar' : 'Adicionar';
    const title = initialDate ? "Atualizar Endereço" : "Adicionar Endereço";
    
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
            complement: initialDate.complement || "",
        } : {
            city: "",
            complement: "",
            country: "",
            neighborhood: "",
            number: "",
            state: "",
            zipCode: "",
            streetAddress: "",
            longitude: "",
            latitude: "",
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: AddressFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateAddress({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createAddress(data);
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
        <div className="space-y-4 w-full">
            <Heading
                title={title}
            />
            {!!form.watch('streetAddress') ? (
                <div className="w-full items-end">
                    <Button
                        onClick={() => form.setValue("streetAddress", "")}
                    >
                        Buscar endereço
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    <SearchAddress 
                        onChange={(address) => form.reset(address)}
                        placeholder="Ex.: Rua teste, 123"
                        textLabel="Buscar endereço"
                        disabled={isLoading}
                    />
                </div>
            )}

            {!!form.watch('streetAddress') ? (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            <FormField 
                                control={form.control}
                                name="neighborhood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="ex.: 123"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="neighborhood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bairro</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>País</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                             
                            <FormField 
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder=""
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
            ) : (
                <div className="flex justify-end pt-8">
                    <div className="flex flex-wrap gap-4 justify-end">
                        <Button
                            onClick={() => form.reset({
                                ...initialDate,
                                complement: initialDate?.complement || "",
                            })}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default FormAddress;