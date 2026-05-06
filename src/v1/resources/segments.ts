import { z } from 'zod';
import { Snowflake } from './globals';

/** https://docs.rewritetoday.com/en/api/openapi-segments.json */
export const APISegment = z.object({
	id: Snowflake,
	createdAt: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	color: z.string().nullable(),
	contactsCount: z.number(),
	sandbox: z.boolean(),
	updatedAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-segments.json */
export type APISegment = z.infer<typeof APISegment>;
