import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import type { Metadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// This is a new feature in NextJs 15
//type SearchType = { [key: string]: string | undefined };

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { customerId } = await searchParams;
  if (!customerId) return { title: "New Customer" }
  return { title: `Edit Customer #${customerId}`}
};

// Also a new feature, define the component as async in order to have access to data (DB layer)
export default async function CustomerFormPage({ searchParams }: Props) {
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
