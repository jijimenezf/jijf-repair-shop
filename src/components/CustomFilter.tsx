import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/DebouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
  filteredRows: string[],
};

export default function CustomFilter<T>({ column, filteredRows }: Props<T>) {
  const columnFilterValue = column.getFilterValue();
  const uniqueFilteredValues = new Set(filteredRows);
  const sortedUniqueValues = Array.from(uniqueFilteredValues).sort();

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option key={`${i}-${column.id}`} value={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${uniqueFilteredValues.size})`}
        className="w-full border shadow rounded bg-card"
        list={column.id + 'list'}
      />
    </>
  );
}
