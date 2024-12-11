import { db } from "@/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTicket(id: number) {
  const results = await db.select().from(tickets).where(eq(tickets.id, id));

  return results.length > 0 ? results[0] : null;
}
