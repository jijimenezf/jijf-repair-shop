import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tickets } from "@/db/schema";
import { z } from "zod";

export const insertTicketSchema = createInsertSchema(tickets, {
    id: z.union([z.number(), z.literal("(New)")]),
    title: (schema) => schema.min(1, "Title is required"),
    description: (schema) => schema.min(1, "Description is required"),
    tech: (schema) => schema.email("Invalid email address"),
});

/*const userSelectSchema = createSelectSchema(tickets, {
    name: (schema) => schema.max(20), // Extends schema
    bio: (schema) => schema.max(1000), // Extends schema before becoming nullable/optional
    preferences: z.object({ theme: z.string() }) // Overwrites the field, including its nullability
  });*/

export const selectTicketSchema = createSelectSchema(tickets);

export type insertTicketType = typeof insertTicketSchema._type;

export type selectTicketType = typeof selectTicketSchema._type;
