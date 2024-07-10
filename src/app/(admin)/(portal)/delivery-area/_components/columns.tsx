"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { DeliveryAreaType } from "@/types"

export const columns: ColumnDef<DeliveryAreaType>[] = [
  {
    header: "Área",
    cell: ({ row }) => <span>{row.original.range}km</span>
  },
  {
    header: "Taxa",
    cell: ({ row }) => <span>R$ {row.original.fee}</span>
  },
  {
    header: "Tempo",
    cell: ({ row }) => <span>{row.original.time}min</span>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]