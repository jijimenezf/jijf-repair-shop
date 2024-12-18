import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { ilike, or, eq } from "drizzle-orm";

export async function getOpenTickets() {
    const results = await db.select({
        id: tickets.id,
        ticketDate: tickets.createdAt,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,
    }).from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false));

    return results;
}

export async function getTicketsBySearch(searchText: string) {
    const wildcard = `%${searchText}%`;
    const results = await db.select({
        id: tickets.id,
        ticketDate: tickets.createdAt,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,
    })
      .from(tickets)
      .leftJoin(customers, eq(tickets.customerId, customers.id))
      .where(or(
        ilike(tickets.title, wildcard),
        ilike(tickets.description, wildcard),
        ilike(tickets.tech, wildcard),
        ilike(customers.firstName, wildcard),
        ilike(customers.lastName, wildcard),
        ilike(customers.email, wildcard),
        ilike(customers.phone, wildcard),
        ilike(customers.address1, wildcard),
        ilike(customers.address2, wildcard),
        ilike(customers.city, wildcard),
        ilike(customers.state, wildcard),
        ilike(customers.zip, wildcard),
      ));

    return results;
}
