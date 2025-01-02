import { db } from "@/db";
import { customers } from "@/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function getCustomersBySearch(searchText: string) {
    const wildcard = `%${searchText}%`;
    const results = await db.select()
      .from(customers)
      .where(or(
        ilike(customers.email, wildcard),
        ilike(customers.phone, wildcard),
        ilike(customers.city, wildcard),
        ilike(customers.zip, wildcard),
        sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`,
      )).orderBy(customers.lastName);

    return results;
}
