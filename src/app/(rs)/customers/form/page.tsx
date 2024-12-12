import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";

// This is a new feature in NextJs 15
type SearchType = { [key: string]: string | undefined };

export async function generateMetada({
  searchParams,
}: {
  searchParams: Promise<SearchType>;
}) {
  const { customerId } = await searchParams;
  if (!customerId) return { title: "New Customer" }
  return { title: `Edit Customer #${customerId}`}
};

// Also a new feature, define the component as async in order to have access to data (DB layer)
export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<SearchType>;
}) {
  try {
    // This value is obtained from the url
    const { customerId } = await searchParams;

    if (customerId) {
      const customerData = await getCustomer(parseInt(customerId));

      if (!customerData) {
        return (
          <>
            <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
            <BackButton title="Go Back" variant="secondary" />
          </>
        );
      }
      return <CustomerForm customer={customerData} />
    } else {
      //New customer form component
      return <CustomerForm />
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}
