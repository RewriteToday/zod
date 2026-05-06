import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

/** https://docs.rewritetoday.com/en/api/openapi-webhooks.json */
export const WebhookEventType = NamedEnum(
	{
		SMSOTP: 'sms.otp',
		MessageSent: 'message.sent',
		MessageBatch: 'message.batch',
		MessageQueued: 'message.queued',
		MessageFailed: 'message.failed',
		MessageCanceled: 'message.canceled',
		MessageDelivered: 'message.delivered',
		MessageReceived: 'message.received',
		MessageScheduled: 'message.scheduled',
	},
	'https://docs.rewritetoday.com/en/api/openapi-webhooks.json',
);

/** https://docs.rewritetoday.com/en/api/openapi-webhooks.json */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

/** Event selector accepted by webhook management endpoints. */
export const WebhookEventSelection = WebhookEventType;

/** Event selector accepted by webhook management endpoints. */
export type WebhookEventSelection = z.infer<typeof WebhookEventSelection>;

/** Delivery result recorded by Rewrite for one webhook attempt. */
export const WebhookDeliveryStatus = NamedEnum(
	{
		Failed: 'FAILED',
		Success: 'SUCCESS',
	},
	'https://docs.rewritetoday.com/en/api/openapi-webhooks.json',
);

/** Delivery result recorded by Rewrite for one webhook attempt. */
export type WebhookDeliveryStatus = z.infer<typeof WebhookDeliveryStatus>;

/** Optional delivery tuning stored with a webhook. */
export const APIWebhookDelivery = z.object({
	timeout: z.number(),
	retries: z.number(),
});

/** Optional delivery tuning stored with a webhook. */
export type APIWebhookDelivery = z.infer<typeof APIWebhookDelivery>;

/** https://docs.rewritetoday.com/en/api/openapi-webhooks.json */
export const APIWebhook = z.object({
	id: Snowflake,
	name: z.string().nullable(),
	events: z.array(WebhookEventSelection),
	isEnabled: z.boolean(),
	sandbox: z.boolean(),
	endpoint: z.string(),
	retries: z.number(),
	timeout: z.number(),
	lastDeliveryAt: z.string().nullable(),
	createdAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-webhooks.json */
export type APIWebhook = z.infer<typeof APIWebhook>;

/** Webhook payload returned when the secret is available. */
export const APIWebhookWithSecret = APIWebhook.extend({
	secret: z.string(),
});

/** Webhook payload returned when the secret is available. */
export type APIWebhookWithSecret = z.infer<typeof APIWebhookWithSecret>;

/** Summary payload used by list endpoints. */
export const APIWebhookSummary = APIWebhook;

/** Summary payload used by list endpoints. */
export type APIWebhookSummary = z.infer<typeof APIWebhookSummary>;
