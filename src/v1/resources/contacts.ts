import { z } from 'zod';
import { CountryCode, Snowflake } from './globals';
import { MessageType } from './message';

/**
 * https://docs.rewritetoday.com/api-reference/contacts
 */
export const APIContact = z.object({
	/** Contact ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Timestamp when the contact was created. */
	createdAt: z.string(),

	/** Timestamp when the contact was last updated. */
	updatedAt: z.string(),

	/** Optional human-readable name for the contact. */
	name: z.string().nullable(),

	/** Contact number in E.164 format. */
	phone: z.string(),

	/** Lowercase ISO 3166-1 alpha-2 country code inferred from the number. */
	country: CountryCode,

	/** Preferred channel stored for the contact, when available. */
	channel: MessageType.nullable(),

	/** Arbitrary contact metadata stored by Rewrite. */
	tags: z.object({}).catchall(z.unknown()),
});

/**
 * https://docs.rewritetoday.com/api-reference/contacts
 */
export type APIContact = z.infer<typeof APIContact>;
