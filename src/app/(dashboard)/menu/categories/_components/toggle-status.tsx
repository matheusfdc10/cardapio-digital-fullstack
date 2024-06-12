"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
// import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateDishCategory } from "@/actions/updateDishCategory";

interface ToggleStatus {
    id: string;
    status: boolean;
}

export const ToggleStatus: React.FC<ToggleStatus> = ({
    id,
    status
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async () => {
        try {
          setIsLoading(true)

          await updateDishCategory({
            id,
            status: !status
          })
        //   toast({
        //     description: "Status alterado!"
        //   });
          router.refresh();
        } catch(error) {
        //   toast({
        //     variant: "destructive",
        //     description: "Algo deu errado."
        //   })
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
                    status ? "bg-emerald-500 hover:bg-emerald-500/80" : "bg-red-500 hover:bg-red-500/80"
                )}
            >
                {status ? "Ativo" : "Inativo"}
            </button>
        </div>
    )
}