import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { ilike, or, eq, asc, sql } from "drizzle-orm";

export async function getOpenTickets() {
    const results = await db.select({
        id: tickets.id,
        ticketDate: tickets.createdAt,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,
        completed: tickets.completed,
    }).from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt));

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
        completed: tickets.completed,
    })
      .from(tickets)
      .leftJoin(customers, eq(tickets.customerId, customers.id))
      .where(or(
        ilike(tickets.title, wildcard),
        ilike(tickets.tech, wildcard),
        ilike(customers.email, wildcard),
        ilike(customers.phone, wildcard),
        ilike(customers.city, wildcard),
        ilike(customers.zip, wildcard),
        sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`,
      )).orderBy(asc(tickets.createdAt));

    return results;
}

export type TicketSearchType = Awaited<ReturnType<typeof getTicketsBySearch>>;
