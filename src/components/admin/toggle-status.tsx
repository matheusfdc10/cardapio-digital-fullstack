"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Response = {
    success?: string;
    error?: string;
    data: any;
}

interface ToggleStatus {
    status: boolean;
    action: () => Promise<Response>;
}

export const ToggleStatus: React.FC<ToggleStatus> = ({
    status,
    action,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async () => {
        try {
          setIsLoading(true)

          const response = await action()
          
          if (response.error) {
            toast({
                variant: 'destructive',
                description: 'Não foi possível alterar status'
            });
          }
          
          if (response.success) {
            toast({
                description: "Status alterado!"
            });

            router.refresh();
          }

        } catch(error) {
          toast({
            variant: "destructive",
            description: "Algo deu errado."
          })
        } finally {
          setIsLoading(false)
        }
    }

    return (
        <div className="w-[70px]">
            <button
                disabled={isLoading}
                onClick={updateStatus}
                className={cn(
                    "rounded-2xl text-white font-medium py-1 px-3 active:scale-95 transition-colors",
                    status ? "bg-emerald-400 hover:bg-emerald-400/85" : "bg-red-400 hover:bg-red-400/85"
                )}
            >
                {status ? "Ativo" : "Inativo"}
            </button>
        </div>
    )
}