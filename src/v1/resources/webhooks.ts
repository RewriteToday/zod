import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export const WebhookEventType = NamedEnum(
	{
		/** Fired when an OTP SMS was sent. */
		SMSOTP: 'sms.otp',

		/** Fired when a message was sent. */
		MessageSent: 'message.sent',

		/** Fired when a batch message was sent. */
		MessageBatch: 'message.batch',

		/** Fired when an message enters the queue. */
		MessageQueued: 'message.queued',

		/** Fired when an message reaches the destination. */
		MessageDelivered: 'message.delivered',

		/** Fired when an message is scheduled for later. */
		MessageScheduled: 'message.scheduled',

		/** Fired when an message delivery fails. */
		MessageFailed: 'message.failed',

		/** Fired when an message is canceled before delivery. */
		MessageCanceled: 'message.canceled',
	},
	'https://docs.rewritetoday.com/api-reference/webhooks',
);

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

/** Wildcard selector that subscribes a webhook to every supported event. */
export const WEBHOOK_ALL_EVENTS = '*';

/** Event selector accepted by webhook create and update endpoints. */
export const WebhookEventSelection = z.union([
	WebhookEventType,
	z.literal(WEBHOOK_ALL_EVENTS),
]);

/** Event selector accepted by webhook create and update endpoints. */
export type WebhookEventSelection = z.infer<typeof WebhookEventSelection>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export const WebhookStatus = NamedEnum(
	{
		/** The webhook is active and receiving events. */
		Active: 'ACTIVE',

		/** The webhook is paused and not receiving events. */
		Inactive: 'INACTIVE',
	},
	'https://docs.rewritetoday.com/api-reference/webhooks',
);

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type WebhookStatus = z.infer<typeof WebhookStatus>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export const APIWebhookDelivery = z.object({
	/** Timeout in milliseconds before Rewrite aborts the attempt. */
	timeout: z.number(),

	/** Number of retries allowed after the first failed attempt. */
	retries: z.number(),
});

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type APIWebhookDelivery = z.infer<typeof APIWebhookDelivery>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export const APIWebhook = z.object({
	/** Webhook ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Webhook name (1-32 max). */
	name: z.string().nullable(),

	/** Secret content to send in events. */
	secret: z.string(),

	/** Destination URL for webhook events. */
	endpoint: z.string(),

	/** Subscribed events. */
	events: z.array(WebhookEventSelection),

	/** Current status as {@link WebhookStatus}. */
	status: WebhookStatus,

	/** Timeout in milliseconds before Rewrite aborts the attempt. */
	timeout: z.number(),

	/** Number of retries allowed after the first failed attempt. */
	retries: z.number(),

	/** Timestamp when the webhook endpoint was created. */
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type APIWebhook = z.infer<typeof APIWebhook>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export const APIWebhookSummary = APIWebhook.omit({
	secret: true,
});

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type APIWebhookSummary = z.infer<typeof APIWebhookSummary>;
