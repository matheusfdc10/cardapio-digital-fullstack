'use client'

import { getAddress } from "@/actions/admin/address";
import { createDeliveryArea, deleteDeliveryArea, updateDeliveryArea } from "@/actions/admin/delivery-area";
import MapArea from "@/components/map-area";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DeliveryAreaSchema } from "@/schemas/delivery-area";
import { AddressType, DeliveryAreaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState,useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = DeliveryAreaSchema.omit({ id: true, updatedAt:true, createdAt: true, restaurantId: true });

export type DeliveryAreaFormValues = z.infer<typeof formSchema>;

interface FormProps {
    initialDate: DeliveryAreaType | null;
    onClose?: () => void;
}

const FormComponent: React.FC<FormProps> = ({
    initialDate,
    onClose,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState<AddressType | null>(null);
    const [isPending, startTransition] = useTransition();
    
    const action = initialDate ? "Salvar alterações" : "Adicionar";
    
    const form = useForm<DeliveryAreaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate,
        } : {
            range: 0,
            fee: 0,
            time: 1
        },
    })

    const isLoading = isPending || form.formState.isSubmitting;

    const onSubmit = async (data: DeliveryAreaFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateDeliveryArea({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createDeliveryArea(data);
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
                if (onClose) onClose()
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
            const response = await deleteDeliveryArea(initialDate.id);

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
                if (onClose) onClose()
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
        startTransition(async () => {
            const response = await getAddress()

            if(response.success) {
                setAddress(response.data);
            }

            if(response.error) {
                toast({
                    variant: "destructive",
                    description: response.error,
                });
            }
        })
    }, [])

    return (
        <>
            <AlertModal
                titile={`Excluir área de entrega?`}
                description="Essa ação não pode ser desfeita"
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            <div className="space-y-4">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <FormField 
                                control={form.control}
                                name="range"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Distancia (km)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="Ex.: 2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Taxa</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="Ex.: 0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tempo (minuto)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="Ex.: 30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="pt-4">
                            <MapArea
                                lat={Number(address?.latitude)}
                                lng={Number(address?.longitude)}
                                distance={form.watch('range') || 0}
                            />
                        </div>

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
 
export default FormComponent;