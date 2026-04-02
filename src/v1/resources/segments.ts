import { z } from 'zod';
import { Snowflake } from './globals';

/**
 * https://docs.rewritetoday.com/api-reference/segments
 */
export const APISegment = z.object({
	/** Segment ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Timestamp when the segment was created. */
	createdAt: z.string(),

	/** Timestamp when the segment was last updated. */
	updatedAt: z.string(),

	/** Segment name. */
	name: z.string(),

	/** Optional HEX color associated with the segment. */
	color: z.string().nullable(),

	/** Optional segment description. */
	description: z.string().nullable(),

	/** Number of contacts currently attached to the segment. */
	contactsCount: z.number(),
});

/**
 * https://docs.rewritetoday.com/api-reference/segments
 */
export type APISegment = z.infer<typeof APISegment>;
