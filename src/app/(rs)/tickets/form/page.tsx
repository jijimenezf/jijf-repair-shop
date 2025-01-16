import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js";
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
  const { customerId, ticketId } = await searchParams;
  if (!customerId && !ticketId) return { title: "Missing TicketId or CustomerId" }
  if (customerId) return { title: `New Ticket for Customer #${customerId}` }
  return { title: `Edit Ticket #${ticketId}` }
};

export default async function TicketformPage({ searchParams }: Props) {
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

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([getPermission('manager'), getUser()]);
    const isManager = managerPermission?.isGranted;
    
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

      if (isManager) { /** Only manager can assign a ticket to one tech */
        kindeInit();
        const { users } = await Users.getUsers();
        const optionsTech = users ? users.map(user => ({ id: user.email!, description: user.email! })) : [];
        return <TicketForm customer={customerData} techs={optionsTech} />
      } else {
        return <TicketForm customer={customerData} />
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
      if (customerData) {
        if (isManager) {
          kindeInit();
          const { users } = await Users.getUsers();
          const optionsTech = users ? users.map(user => ({ id: user.email!, description: user.email! })) : [];
          return <TicketForm ticket={ticketData} customer={customerData} techs={optionsTech} />
        } else {
          const isEditable = user.email?.toLowerCase() === ticketData.tech.toLowerCase();
          return <TicketForm customer={customerData} ticket={ticketData} isEditable={isEditable} />
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}
