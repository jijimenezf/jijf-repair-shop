"use client"

import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleCheckIcon, CircleXIcon, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomFilter from "@/components/CustomFilter";
import { useRouter, useSearchParams } from "next/navigation";
import type { TicketSearchType } from "@/lib/queries/getTicketsBySearch";
import { usePolling } from "@/hooks/usePolling";

type TicketTableProps = {
    data: TicketSearchType,
}
type RowType = TicketSearchType[0];

export default function TicketTable({ data }: TicketTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([{
        id: "ticketDate",
        desc: false, // false for ascending, true for descending
    }]);

    usePolling(searchParams.get("searchText"), 300000); // for loading new content in the page automatically

    const pageIndex = useMemo(() => {
      const page = searchParams.get("page");
      return page ? parseInt(page) - 1 : 0;
    }, [searchParams.get("page")]);

    const columnHeaders: Array<keyof RowType> = [
        "ticketDate",
        "title",
        "tech",
        "firstName",
        "lastName",
        "email",
        "completed",
    ];

    const columnWidths = {
      completed: 150,
      ticketDate: 150,
      title: 250,
      tech: 225,
      email: 225,
  }

    const columnHelper = createColumnHelper<RowType>();

    const columns = columnHeaders.map((columnName) => {
        return columnHelper.accessor((row) => { // transformational function
            const value = row[columnName];
            if (columnName === "ticketDate" && value instanceof Date) {
                return new Intl.DateTimeFormat('es-MX', {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(value);
            }
            if (columnName === "completed") {
                return value ? "COMPLETED" : "OPEN";
            }
            return value;
        }, {
            id: columnName,
            size: columnWidths[columnName as keyof typeof columnWidths] ?? undefined,
            header: ({ column }) => {
                return (
                    <Button
                      variant="ghost"
                      className="pl-1 w-full flex justify-between"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {columnName[0].toUpperCase() + columnName.slice(1)}
                        {column.getIsSorted() === "asc" && ( <ArrowUp className="ml-2 h-4 w-4" />)}
                        {column.getIsSorted() === "desc" && ( <ArrowDown className="ml-2 h-4 w-4" />)}
                        {column.getIsSorted() !== "desc" && column.getIsSorted() !== "asc" && ( <ArrowUpDown className="ml-2 h-4 w-4" />)}
                    </Button>
                );
            },
            cell: ({ getValue }) => { // presentational function
                const value = getValue();
                if (columnName === "completed") {
                    return (
                        <div className="grid place-content-center">
                            { value === "OPEN" ? <CircleXIcon className="h-6 w-6 text-red-500 opacity-25" /> : <CircleCheckIcon className="h-6 w-6 text-green-500" />}
                        </div>
                    )
                }
                return value;
            },
        });
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination: {
              pageIndex,
              pageSize: 10,
            }
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
      const currentPageIndex = table.getState().pagination.pageIndex;
      const pageCount = table.getPageCount();

      if (pageCount <= currentPageIndex && currentPageIndex > 0) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }, [table.getState().columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden border border-border">
          <Table className="border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-secondary p-1" style={{ width: header.getSize() }}>
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className="grid place-content-center">
                          <CustomFilter 
                            column={header.column} 
                            filteredRows={table.getFilteredRowModel().rows.map(row => row.getValue(header.column.id))}
                          />
                        </div>
                      ) : null}
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
                  onClick={() =>
                    router.push(`/tickets/form?ticketId=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          resetSorting={table.resetSorting}
          resetColumnFilters={table.resetColumnFilters}
          previousPage={table.previousPage}
          nextPage={table.nextPage}
          setPageIndex={table.setPageIndex}
          isDisabledPrevious={!table.getCanPreviousPage()}
          isDisabledNext={!table.getCanNextPage()}
          totalPages={table.getPageCount()}
          currentPage={table.getState().pagination.pageIndex + 1}
        />
      </div>
    );
}
/** Internal component. It can be relocated for reusability. Currently is only used for tickets */
type PaginationProps = {
    resetSorting: () => void,
    resetColumnFilters: () => void,
    previousPage: () => void,
    nextPage: () => void,
    setPageIndex: (pageIndex: number) => void,
    isDisabledPrevious: boolean,
    isDisabledNext: boolean,
    totalPages: number,
    currentPage: number,
}
function Pagination({
  resetSorting,
  resetColumnFilters,
  previousPage,
  nextPage,
  setPageIndex,
  isDisabledPrevious = true,
  isDisabledNext = true,
  totalPages,
  currentPage = 1,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex basis-1/3 items-center">
        <p className="whitespace-nowrap font-bold">
          {`Page ${currentPage} of ${totalPages}`}
        </p>
      </div>
      <div className="space-x-1">
        <Button variant="outline" onClick={() => resetSorting()}>
          Reset Sorting
        </Button>
        <Button variant="outline" onClick={() => resetColumnFilters()}>
          Reset Filters
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => setPageIndex(0)}
          disabled={isDisabledPrevious}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          onClick={() => previousPage()}
          disabled={isDisabledPrevious}
        >
          {"<"}
        </Button>
        <Button
          variant="outline"
          onClick={() => nextPage()}
          disabled={isDisabledNext}
        >
          {">"}
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => setPageIndex(totalPages - 1)}
          disabled={isDisabledNext}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
}
