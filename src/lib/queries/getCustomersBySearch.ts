import { db } from "@/db";
import { customers } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function getCustomersBySearch(searchText: string) {
    const wildcard = `%${searchText}%`;
    const results = await db.select()
      .from(customers)
      .where(or(
        ilike(customers.firstName, wildcard),
        ilike(customers.lastName, wildcard),
        ilike(customers.email, wildcard),
        ilike(customers.phone, wildcard),
        ilike(customers.address1, wildcard),
        ilike(customers.address2, wildcard),
        ilike(customers.city, wildcard),
        ilike(customers.state, wildcard),
        ilike(customers.zip, wildcard),
        ilike(customers.notes, wildcard),
      ));

    return results;
}
