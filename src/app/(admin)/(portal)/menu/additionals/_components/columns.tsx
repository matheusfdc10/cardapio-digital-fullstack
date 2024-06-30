"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/admin/toggle-status"
import { AdditionalType } from "@/types"
import { updateAdditional } from "@/actions/admin/additional"

export const columns: ColumnDef<AdditionalType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    header: "N° de categorias",
    cell: ({ row }) => <span>{row.original.categoryIds.length.toString()}</span>
  },
  {
    // accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus status={row.original.status} action={async () => {
      return await updateAdditional({
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