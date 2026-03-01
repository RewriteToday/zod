import { type _ZodType, z } from 'zod';
import { StringEnum } from '../utils';
import { Snowflake } from './resources/common';

const E164PhoneNumber = z
	.string()
	.regex(/^\+[1-9]\d{1,14}$/, 'Expected a valid E.164 phone number.')
	.describe(
		'Destination phone number in global E.164 format, ready for dependable delivery.',
	);

const WebhookSMSMetadata = z
	.record(z.string(), z.unknown())
	.nullable()
	.describe(
		'Original message metadata, preserved so your team can power analytics, routing, and reconciliation.',
	);

const BaseWebhookSMSData = z.object({
	id: Snowflake.describe(
		'Unique Rewrite SMS ID for traceable message lifecycles across your entire workflow.',
	),
	to: E164PhoneNumber,
	provider: z
		.string()
		.min(1)
		.nullable()
		.describe(
			'Delivery provider selected for this message when Rewrite has one available.',
		),
	metadata: WebhookSMSMetadata,
});

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export const WebhookEventType = StringEnum(
	[
		'sms.queued',
		'sms.sent',
		'sms.scheduled',
		'sms.delivered',
		'sms.failed',
		'sms.canceled',
	],
	'Live webhook event emitted by the Rewrite messaging engine as messages move forward.',
);

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export type WebhookEventType = z.infer<typeof WebhookEventType>;

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export const SMSStatus = StringEnum(
	['QUEUED', 'SENT', 'SCHEDULED', 'DELIVERED', 'FAILED', 'CANCELED'],
	'Message lifecycle status reported by Rewrite so your systems can react instantly.',
);

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export type SMSStatus = z.infer<typeof SMSStatus>;

export const BaseWebhookEvent = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	schema: Schema,
) =>
	z.object({
		type: z
			.literal(type)
			.describe(
				'Event type that lets your handler route business logic with zero guesswork.',
			),
		id: Snowflake.describe(
			'Unique event ID built for idempotent processing, observability, and resilient automation.',
		),
		createdAt: z.coerce
			.date()
			.describe(
				'Emission timestamp so your systems can reason about timing with precision.',
			),
		data: schema.describe(
			'Rich message snapshot captured at the exact moment Rewrite emitted this event.',
		),
	});

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-queued
 */
export const WebhookSMSQueuedEvent = BaseWebhookEvent(
	'sms.queued',
	BaseWebhookSMSData.extend({
		status: z
			.literal('QUEUED')
			.describe(
				'Lifecycle state for this event. Always `QUEUED` while Rewrite prepares delivery.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-queued
 */
export type WebhookSMSQueuedEvent = z.infer<typeof WebhookSMSQueuedEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export const WebhookSMSSentEvent = BaseWebhookEvent(
	'sms.sent',
	BaseWebhookSMSData.extend({
		status: z
			.literal('SENT')
			.describe(
				'Lifecycle state for this event. Always `SENT` once Rewrite hands off the message.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export type WebhookSMSSentEvent = z.infer<typeof WebhookSMSSentEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-scheduled
 */
export const WebhookSMSScheduledEvent = BaseWebhookEvent(
	'sms.scheduled',
	BaseWebhookSMSData.extend({
		status: z
			.literal('SCHEDULED')
			.describe(
				'Lifecycle state for this event. Always `SCHEDULED` while Rewrite waits for the right send window.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-scheduled
 */
export type WebhookSMSScheduledEvent = z.infer<typeof WebhookSMSScheduledEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-delivered
 */
export const WebhookSMSDeliveredEvent = BaseWebhookEvent(
	'sms.delivered',
	BaseWebhookSMSData.extend({
		status: z
			.literal('DELIVERED')
			.describe(
				'Lifecycle state for this event. Always `DELIVERED` after successful arrival.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-delivered
 */
export type WebhookSMSDeliveredEvent = z.infer<typeof WebhookSMSDeliveredEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-failed
 */
export const WebhookSMSFailedEvent = BaseWebhookEvent(
	'sms.failed',
	BaseWebhookSMSData.extend({
		status: z
			.literal('FAILED')
			.describe(
				'Lifecycle state for this event. Always `FAILED` when delivery cannot be completed.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-failed
 */
export type WebhookSMSFailedEvent = z.infer<typeof WebhookSMSFailedEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-canceled
 */
export const WebhookSMSCanceledEvent = BaseWebhookEvent(
	'sms.canceled',
	BaseWebhookSMSData.extend({
		status: z
			.literal('CANCELED')
			.describe(
				'Lifecycle state for this event. Always `CANCELED` when the message is stopped before delivery.',
			),
	}),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/sms-canceled
 */
export type WebhookSMSCanceledEvent = z.infer<typeof WebhookSMSCanceledEvent>;

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export const WebhookEvent = z.discriminatedUnion('type', [
	WebhookSMSQueuedEvent,
	WebhookSMSSentEvent,
	WebhookSMSScheduledEvent,
	WebhookSMSDeliveredEvent,
	WebhookSMSFailedEvent,
	WebhookSMSCanceledEvent,
]);

/**
 * https://docs.rewritetoday.com/en/webhooks/types
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>;
