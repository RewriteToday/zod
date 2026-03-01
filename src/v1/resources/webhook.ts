import { z } from 'zod';
import { HasUniqueItems, StringEnum } from '../../utils';
import { Snowflake } from './common';

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export const WebhookSubscriptionEventType = StringEnum(
	[
		'sms.queued',
		'sms.delivered',
		'sms.scheduled',
		'sms.failed',
		'sms.canceled',
	],
	'Production webhook event your Rewrite integration can subscribe to with confidence.',
);

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export type WebhookSubscriptionEventType = z.infer<
	typeof WebhookSubscriptionEventType
>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export const WebhookStatus = StringEnum(
	['ACTIVE', 'INACTIVE'],
	'Delivery state that controls whether your webhook is actively powering real-time automation.',
);

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export type WebhookStatus = z.infer<typeof WebhookStatus>;

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export const APIWebhook = z
	.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for this webhook endpoint, ready for reliable operational tracking.',
		),
		name: z
			.string()
			.min(1)
			.max(32)
			.nullable()
			.optional()
			.describe(
				'Optional display name that keeps webhook destinations easy to recognize.',
			),
		endpoint: z
			.url()
			.max(255)
			.describe(
				'HTTPS destination where Rewrite delivers real-time events to your product.',
			),
		events: z
			.array(WebhookSubscriptionEventType)
			.refine((items) => HasUniqueItems(items, (item) => item), {
				message: 'Webhook event subscriptions must be unique.',
			})
			.describe(
				'Subscribed events currently routed to this endpoint for instant automation.',
			),
		status: WebhookStatus.describe(
			'Current lifecycle status that tells you whether this webhook is live and delivering.',
		),
		createdAt: z.coerce
			.date()
			.describe(
				'Creation timestamp for tracking when this webhook went live in your stack.',
			),
	})
	.describe(
		'Webhook endpoint configuration built for reliable event delivery and fast product automation.',
	);

/**
 * https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export type APIWebhook = z.infer<typeof APIWebhook>;
