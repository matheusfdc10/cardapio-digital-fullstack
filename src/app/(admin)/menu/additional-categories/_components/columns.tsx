"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/admin/toggle-status"
import { updateDishCategory } from "@/actions/admin/dish-category"
import { AdditionalCategoryType } from "@/types"
import { updateAdditionalCategory } from "@/actions/admin/additional-category"

export const columns: ColumnDef<AdditionalCategoryType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    header: "N° de Prato(s)",
    cell: ({ row }) => <span>{row.original.dishIds.length.toString()}</span>
  },
  {
    header: "N° de Adicionais(s)",
    cell: ({ row }) => <span>{row.original.additionalIds.length.toString()}</span>
  },
  {
    // accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus status={row.original.status} action={async () => {
      return await updateAdditionalCategory({
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