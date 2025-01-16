"use server";

import { eq } from 'drizzle-orm';
import { flattenValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { insertCustomerSchema } from '@/zod-schemas/customer';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const saveCustomer = actionClient
  .metadata({ actionName: 'saveCustomer' })
  .schema(insertCustomerSchema, { handleValidationErrorsShape: 
    async (validationErr) => flattenValidationErrors(validationErr).fieldErrors })
  .action(async ({ parsedInput }) => {  // must to be named parsedInput and it's already typed
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    if (!isAuth) redirect('/login');

    // New Customer, All new customers are active by default - no need to set active to true
    const { firstName, lastName, email, phone, address1, 
        address2, city, state, zip, notes, active } = parsedInput;
    if (parsedInput.id === 0) {
        const result = await db.insert(customers).values({
            firstName, lastName, email, phone, address1,
            ...(address2?.trim() ? { address2 } : {}),
            city, state, zip,
            ...(notes?.trim() ? { notes } : {}),
        }).returning( { insertedId: customers.id });

        return { message: `Customer ID ${result[0].insertedId} created sucessfully` };
    }
    // Existing customer, updatedAt is set by the database
    const result = await db.update(customers).set({
        firstName, lastName, email, phone, address1,
        ...(address2?.trim() ? { address2 } : null),
        city, state, zip,
        ...(notes?.trim() ? { notes } : null), active,
    }).where(eq(customers.id, parsedInput.id!))
    .returning({ updatedId: customers.id });

    return { message: `Customer ID ${result[0].updatedId} updated sucessfully`};
  });
