import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';
import { WebhookEventType } from './webhooks';

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export const WebhookDeliveryStatus = NamedEnum(
	{
		Success: 'SUCCESS',
		Failed: 'FAILED',
	},
	'https://docs.rewritetoday.com/api-reference/logs',
);

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export type WebhookDeliveryStatus = z.infer<typeof WebhookDeliveryStatus>;

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export const APIWebhookLog = z.object({
	/** Webhook log in {@link Snowflake} format. */
	id: Snowflake,

	/** Timestamp when Rewrite recorded the delivery attempt. */
	createdAt: z.string(),

	/** Webhook identifier associated with the log entry. */
	webhookId: Snowflake.nullable(),

	/** Message identifier associated with the delivery attempt, when available. */
	messageId: Snowflake.nullable(),

	/** Webhook event type delivered in this attempt. See {@link WebhookEventType} */
	type: WebhookEventType,

	/** Transport or application error captured for the attempt. */
	error: z.string().nullable(),

	/** Delivery outcome recorded by Rewrite. See {@link WebhookDeliveryStatus} */
	status: WebhookDeliveryStatus,

	/** Endpoint URL that received the delivery attempt. */
	url: z.string(),

	/** HTTP status code returned by the destination endpoint. */
	code: z.number().nullable(),

	/** Event payload delivered during this attempt. */
	payload: z.object({}).catchall(z.unknown()),

	/** Attempt number for this delivery. */
	attempt: z.number(),

	/**Round-trip time in milliseconds. */
	latency: z.number().nullable(),

	/** Next scheduled retry time, when the attempt failed and will retry. */
	retryAt: z.string().nullable(),
});

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export type APIWebhookLog = z.infer<typeof APIWebhookLog>;

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export const APIWebhookLogSummary = APIWebhookLog.omit({
	payload: true,
	webhookId: true,
});

/**
 * https://docs.rewritetoday.com/api-reference/logs
 */
export type APIWebhookLogSummary = z.infer<typeof APIWebhookLogSummary>;
