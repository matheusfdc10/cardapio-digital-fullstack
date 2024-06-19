"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/admin/toggle-status"
import { updateDishCategory } from "@/actions/admin/dish-category"
import { DishCategoryType } from "@/types"

export const columns: ColumnDef<DishCategoryType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    header: "N° de Prato(s)",
    cell: ({ row }) => <span>{row.original.dishes.length.toString()}</span>
  },
  {
    // accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus status={row.original.status} action={async () => {
      return await updateDishCategory({
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