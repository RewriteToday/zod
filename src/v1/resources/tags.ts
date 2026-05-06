import { z } from 'zod';
import { Snowflake } from './globals';

/** https://docs.rewritetoday.com/en/api/openapi-tags.json */
export const APITag = z.object({
	id: Snowflake,
	name: z.string(),
	color: z.string().nullable(),
	description: z.string().nullable(),
	contactsCount: z.number(),
	createdAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-tags.json */
export type APITag = z.infer<typeof APITag>;

/** Result returned when a tag is created. */
export const APICreatedTag = z.object({
	id: Snowflake,
	slug: z.string(),
	createdAt: z.string(),
});

/** Result returned when a tag is created. */
export type APICreatedTag = z.infer<typeof APICreatedTag>;
