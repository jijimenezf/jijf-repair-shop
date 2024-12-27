import { Metadata } from "next";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import CustomSearch from "@/components/CustomSearch";
import { getOpenTickets, getTicketsBySearch } from "@/lib/queries/getTicketsBySearch";
import TicketTable from "@/app/(rs)/tickets/TicketTable";
import type { TicketSearchType } from "@/lib/queries/getTicketsBySearch";

export const metadata: Metadata = {
  title: "Ticket Search",
};

type SearchType = { [key: string]: string | undefined };

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<SearchType>;
}) {
  const { searchText } = await searchParams;
  let results: TicketSearchType = [];

  if (!searchText) {
    results = await getOpenTickets();
  } else {
    results = await getTicketsBySearch(searchText);
  }


  return (
    <>
      <Form action="/tickets" className="flex gap-2 items-center">
        <Input name="searchText" type="text" placeholder="Search Tickets" className="w-full" />
        <CustomSearch />
      </Form>
      { results.length > 0 ? <TicketTable data={results} /> : <p className="mt-4">No results found</p>}
    </>
  );
}
