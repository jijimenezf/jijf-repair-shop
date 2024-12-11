import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";

// This is a new feature in NextJs 15
type SearchType = { [key: string]: string | undefined };

export default async function TicketformPage({
  searchParams,
}: {
  searchParams: SearchType;
}) {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="text-2xl mb-2">
            Ticket ID or Customer ID required to load ticket form
          </h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }
    // Not sure about this
    if (customerId) {
      const customerData = await getCustomer(parseInt(customerId));
      if (!customerData) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer Id # {customerId} not found
            </h2>
            <BackButton title="Go Back" variant="secondary" />
          </>
        );
      }

      if (!customerData.active) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton title="Go Back" variant="secondary" />
          </>
        );
      }
    }

    if (ticketId) {
      const ticketData = await getTicket(parseInt(ticketId));
      if (!ticketData) {
        return (
          <>
            <h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found</h2>
            <BackButton title="Go Back" variant="secondary" />
          </>
        );
      }
      const customerData = await getCustomer(ticketData.customerId);
      // return ticket form
      console.log({ ticketData });
      console.log({ customerData });
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}
