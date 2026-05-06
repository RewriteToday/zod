import { z } from 'zod';
import { CountryCode, Metadata, Snowflake } from './globals';
import { MessageType } from './message';

/** https://docs.rewritetoday.com/en/api/openapi-contacts.json */
export const APIContact = z.object({
	id: Snowflake,
	createdAt: z.string(),
	name: z.string().nullable(),
	phone: z.string(),
	country: CountryCode,
	channel: MessageType.nullable(),
	preferredLanguages: z.array(z.string()),
	tags: Metadata,
	sandbox: z.boolean(),
	updatedAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-contacts.json */
export type APIContact = z.infer<typeof APIContact>;

/** Result returned by contact creation. */
export const APICreatedContact = z.object({
	id: Snowflake,
	phone: z.string(),
	country: CountryCode,
	createdAt: z.string(),
	sandbox: z.boolean(),
});

/** Result returned by contact creation. */
export type APICreatedContact = z.infer<typeof APICreatedContact>;

/** Aggregate result returned by contact batch creation/upsert. */
export const APIContactBatchResult = z.object({
	inserted: z.number(),
	updated: z.number(),
	ignored: z.number(),
	total: z.number(),
});

/** Aggregate result returned by contact batch creation/upsert. */
export type APIContactBatchResult = z.infer<typeof APIContactBatchResult>;
