"use client"

import type { selectCustomerType } from "@/zod-schemas/customer";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

type CustomerTableProps = {
    data: selectCustomerType[],
}

export default function CustomerTable({ data }: CustomerTableProps) {
    const router = useRouter();

    const columnHeaders: Array<keyof selectCustomerType> = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "city",
        "zip",
    ];

    const columnHelper = createColumnHelper<selectCustomerType>();

    const columns = columnHeaders.map((columnName) => {
        return columnHelper.accessor(columnName, {
            id: columnName,
            header: columnName[0].toUpperCase() + columnName.slice(1),
        });
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-6 rounded-lg overflow-hidden border border-border">
            <Table className="border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="bg-secondary">
                                    <div>
                                        { header.isPlaceholder ? null : 
                                        flexRender(
                                            header.column.columnDef.header, 
                                            header.getContext())}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                          onClick={() => router.push(`/customers/form?customerId=${row.original.id}`)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="border">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
