import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCustomer(id: number) {
  const results = await db.select().from(customers).where(eq(customers.id, id));

  return results.length > 0 ? results[0] : null;
}
