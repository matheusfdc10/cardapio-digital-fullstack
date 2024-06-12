"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/dashboard/toggle-status"
import { updateDishCategory } from "@/actions/updateDishCategory"

export type DishCategoryColumn = {
  id: string
  name: string
  createdAt: string
  qtdPratos: string
  status: boolean;
  order: number;
}

export const columns: ColumnDef<DishCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "qtdPratos",
    header: "Qtd de Pratos",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus status={row.original.status} action={async () => {
      await updateDishCategory({
        id: row.original.id,
        status: !row.original.status
      })
    }}/>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]