import type { NeonDbError } from "@neondatabase/serverless";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({ actionName: z.string() })
    },
    handleServerError(e, utils) {
        const { clientInput, metadata } = utils;
        
        // It could be different for a non Neon DB instance
        if (e.constructor.name === 'NeonDbError') {
            const { code, detail } = e as NeonDbError;
            if (code === "23505") {
                return `Unique entry required. ${detail}`
            }
            return "Database error: The information was not saved. Please contact technical support"
        }
        return e.message;
    }
});
