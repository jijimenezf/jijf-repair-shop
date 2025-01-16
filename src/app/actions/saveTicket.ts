"use server";

import { eq } from 'drizzle-orm';
import { flattenValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { tickets } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { insertTicketSchema } from '@/zod-schemas/tickets';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const saveTicket = actionClient
  .metadata({ actionName: 'saveTicket' })
  .schema(insertTicketSchema, { handleValidationErrorsShape: 
    async (validationErr) => flattenValidationErrors(validationErr).fieldErrors })
    .action(async ({ parsedInput }) => {  // must to be named parsedInput and it's already typed
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    if (!isAuth) redirect('/login');

    // New Ticket, All new tickets are not completed by default
    const { customerId, title, description, completed, tech } = parsedInput;
    if (parsedInput.id === "(New)") {
        const result = await db.insert(tickets).values({
            customerId, title,
            ...(description?.trim() ? { description } : {}),
            tech,
        }).returning( { insertedId: tickets.id });

        return { message: `Ticket ID ${result[0].insertedId} created sucessfully` };
    }
    // Existing ticket, updatedAt is set by the database
    const result = await db.update(tickets).set({
        customerId, title,
        ...(description?.trim() ? { description } : null),
        completed, tech,
    }).where(eq(tickets.id, parsedInput.id!))
    .returning({ updatedId: tickets.id });

    return { message: `Ticket ID ${result[0].updatedId} updated sucessfully`};
  });
