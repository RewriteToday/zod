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
export const APIWebhook = z.object({
	/** Webhook ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Webhook name (1-32 max). */
	name: z.string(),

	/** Secret content to send in events. */
	secret: z.string(),

	/** Destination URL for webhook events. */
	endpoint: z.string(),

	/** Subscribed events as {@link WebhookEventType}. */
	events: z.array(WebhookEventType),

	/** Current status as {@link WebhookStatus}. */
	status: WebhookStatus,

	/** Project ID in {@link Snowflake} format. */
	projectId: Snowflake,

	/** Timestamp when the webhook endpoint was created. */
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/webhooks
 */
export type APIWebhook = z.infer<typeof APIWebhook>;
