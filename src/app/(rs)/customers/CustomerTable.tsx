"use client"

import type { selectCustomerType } from "@/zod-schemas/customer";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ClipboardPen, TableOfContents } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

type CustomerTableProps = {
    data: selectCustomerType[],
}

export default function CustomerTable({ data }: CustomerTableProps) {

    const columnHeaders: Array<keyof selectCustomerType> = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "city",
        "zip",
    ];

    const columnHelper = createColumnHelper<selectCustomerType>();

    const ActionsCell = ({ row }: CellContext<selectCustomerType, unknown>) => {
      return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Open menu</span>
                        <TableOfContents className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link
                            href={`/tickets/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            New Ticket
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link
                            href={`/customers/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            Edit Customer
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
      );
    };
    ActionsCell.displayName = "ActionsCell"

    const columns = [
        ...columnHeaders.map((columnName) => {
            return columnHelper.accessor(columnName, {
                id: columnName,
                header: columnName[0].toUpperCase() + columnName.slice(1),
            });
        }),
        columnHelper.display({
            id: "actions",
            header: () => <ClipboardPen />,
            cell: ActionsCell,
        }),
    ];

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
                                <TableHead key={header.id} className={`bg-secondary ${header.id === "actions" ? "w-12" : ""}`}> 
                                    <div className={`${header.id === "actions" ? "flex justify-center items-center" : ""}`}>
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
                          className="hover:bg-border/25 dark:hover:bg-ring/40"
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
