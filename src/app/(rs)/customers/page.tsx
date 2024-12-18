import { Metadata } from "next";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import CustomSearch from "@/components/CustomSearch";
import { getCustomersBySearch } from "@/lib/queries/getCustomersBySearch";
import { type selectCustomerType } from "@/zod-schemas/customer"

export const metadata: Metadata = {
  title: "Customer Search",
};

type SearchType = { [key: string]: string | undefined };

export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<SearchType>;
}) {

  const { searchText } = await searchParams;
  let results: selectCustomerType[] = [];
  
  if (searchText) {
    results = await getCustomersBySearch(searchText);
  }
  
  return (
    <>
      <Form action="/customers" className="flex gap-2 items-center">
        <Input name="searchText" type="text" placeholder="Search Customers" className="w-full" />
        <CustomSearch />
      </Form>
      <p>{JSON.stringify(results)}</p>
    </>
  );
}
