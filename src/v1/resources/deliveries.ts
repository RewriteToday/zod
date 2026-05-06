import { z } from 'zod';
import { Snowflake } from './globals';
import { WebhookDeliveryStatus, WebhookEventType } from './webhooks';

/** Compact cross-project delivery record returned by Rewrite. */
export const APICompactDelivery = z.object({
	id: Snowflake,
	url: z.string(),
	code: z.number().nullable(),
	webhookId: Snowflake.nullable(),
	messageId: Snowflake.nullable(),
	sandbox: z.boolean(),
	createdAt: z.string(),
});

/** Compact cross-project delivery record returned by Rewrite. */
export type APICompactDelivery = z.infer<typeof APICompactDelivery>;

/** Detailed delivery summary returned by Rewrite. */
export const APIDeliverySummary = z.object({
	id: Snowflake,
	url: z.string(),
	type: WebhookEventType,
	code: z.number().nullable(),
	error: z.string().nullable(),
	status: WebhookDeliveryStatus,
	attempt: z.number(),
	latency: z.number().nullable(),
	retryAt: z.string().nullable(),
	createdAt: z.string(),
	messageId: Snowflake.nullable(),
	sandbox: z.boolean(),
});

/** Detailed delivery summary returned by Rewrite. */
export type APIDeliverySummary = z.infer<typeof APIDeliverySummary>;
