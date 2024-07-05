"use client"

import { createOpeningHours, deleteOpeningHours, updateOpeningHours } from "@/actions/admin/opening-hours";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { OpeningHoursSchema } from "@/schemas/opening-hours";
import { OpeningHoursType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { AlertModal } from "@/components/modals/alert-modal";
import { useState, useTransition } from "react";

const days = [
    { value: 0, label: 'Domingo'},
    { value: 1, label: 'Segunda'},
    { value: 2, label: 'Terça'},
    { value: 3, label: 'Quarta'},
    { value: 4, label: 'Quinta'},
    { value: 5, label: 'Sexta'},
    { value: 6, label: 'Sabado'},
]

const formSchema = OpeningHoursSchema
.omit({ id: true, createdAt: true, updatedAt: true, restaurantId: true })
.refine((data) => {
    const [opensHour, opensMinute] = data.opensAt.split(":").map(Number);
    const [closesHour, closesMinute] = data.closesAt.split(":").map(Number);

    const opensAtMinutes = opensHour * 60 + opensMinute;
    const closesAtMinutes = closesHour * 60 + closesMinute;

    return opensAtMinutes < closesAtMinutes;
}, {
    message: "O horário de abertura deve ser anterior ao horário de fechamento",
    path: ["opensAt"],
});

export type OpeningHoursFormValues = z.infer<typeof formSchema>;

interface OpeningHoursFormPros {
    initialDate: OpeningHoursType | null,
    dayOfWeek?: number
    onClose?:  () => void
}

const OpeningHoursForm: React.FC<OpeningHoursFormPros> = ({
    initialDate,
    onClose,
    dayOfWeek = 0,
}) => {
    const router = useRouter();
    const [modalState, setModalState] = useState(false);
    const [isPending, startTransition] = useTransition();

    const action = initialDate ? 'Atualizar' : 'Criar';
    // const title = initialDate ? "Atualizar horário" : "Criar horário";
    
    const form = useForm<OpeningHoursFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialDate ? {
            ...initialDate
        } : {
            closesAt: '',
            opensAt: '',
            dayOfWeek: (typeof dayOfWeek === 'number') ? dayOfWeek : -1,
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: OpeningHoursFormValues) => {
        try {
            let response = null

            if (initialDate) {
                response = await updateOpeningHours({
                    id: initialDate.id,
                    ...data
                })
            } else {
                response = await createOpeningHours(data);
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

                form.reset();
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

    const onDelete = () => {
        if (!initialDate) return
        startTransition(async () => {
            try {
                const response = await deleteOpeningHours(initialDate.id);
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
        })
    }

    return (
        <>
            <AlertModal
                onConfirm={() => onDelete()}
                onClose={() => setModalState(false)}
                isOpen={modalState}
                titile="Excluir horário"
                description="Tem certeza que deseja excluir este horário?"
                loading={isPending}
            />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 w-full"
                >
                    {/* <Heading
                        title={title}
                    /> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                            control={form.control}
                            name="opensAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abertura</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            disabled={isLoading}
                                            placeholder="10:00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="closesAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fechamento</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            disabled={isLoading}
                                            placeholder="18:00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />                     
                        <FormField 
                            control={form.control}
                            name="dayOfWeek"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dia da semana</FormLabel>
                                    <Select
                                        value={days.find(day => day.value === field.value)}
                                        onChange={(selectedOptions) => {
                                            field.onChange(selectedOptions?.value);
                                        }}
                                        placeholder="Selecione categoria"
                                        options={days}
                                        isDisabled={isLoading}
                                        classNames={{
                                            
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />                     
                    </div>
                    <div className="flex justify-end pt-8">
                        <div className="flex flex-wrap gap-4 justify-end">
                            {!!initialDate && (
                                <Button
                                    type="button"
                                    onClick={() => setModalState(true)}
                                    variant="destructive"
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
        </>
    );
}
 
export default OpeningHoursForm;