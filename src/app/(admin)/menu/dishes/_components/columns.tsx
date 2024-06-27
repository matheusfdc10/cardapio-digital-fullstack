"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/admin/toggle-status"
import { DishType } from "@/types"
import { updateDish } from "@/actions/admin/dish"

export const columns: ColumnDef<DishType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    header: "N° de adicionais",
    cell: ({ row }) => <span>{row.original.additionalCategories.length.toString()}</span>
  },
  {
    // accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus status={row.original.status} action={async () => {
      return await updateDish({
        id: row.original.id,
        status: !row.original.status,
      })
    }}/>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]