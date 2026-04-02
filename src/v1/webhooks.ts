import { type _ZodType, z } from 'zod';
import { CountryCode, Snowflake } from './resources/globals';
import {
	APIMessageAnalysis,
	APIMessageTag,
	MessageError,
	MessageStatus,
	MessageType,
} from './resources/message';
import { WebhookEventType } from './resources/webhooks';

/**
 * Base schema for Rewrite webhook events.
 */
const WebhookBase = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	data: Schema,
) =>
	z.object({
		/** Event name. See {@link WebhookEventType}. */
		type: z.literal(type),

		/** The data of the event. */
		data,

		/** Webhook event identifier. See {@link Snowflake}. */
		id: Snowflake,

		/** Timestamp when Rewrite sent the event. */
		createdAt: z.string(),
	});

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export const WebhookOTPMetadata = z.object({
	/** Prefix included in the OTP SMS. */
	prefix: z.string(),

	/** Timestamp when the OTP expires. */
	expiresAt: z.string(),

	/** Minutes until the OTP expires. */
	expiresIn: z.number(),
});

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export type WebhookOTPMetadata = z.infer<typeof WebhookOTPMetadata>;

export const WebhookMessagePayload = z.object({
	/** Message identifier. */
	id: Snowflake,

	/** Project identifier that emitted the event. */
	projectId: Snowflake,

	/** Destination number in E.164 format. */
	to: z.string(),

	/** Resolved contact name or phone, when applicable. */
	contact: z.string().nullable(),

	/** Linked contact identifier, when applicable. */
	contactId: Snowflake.nullable(),

	/** Metadata attached to the message. */
	tags: z.array(APIMessageTag),

	/** Message type. */
	type: MessageType,

	/** Latest delivery status known by Rewrite. */
	status: MessageStatus,

	/** Lowercase ISO 3166-1 alpha-2 country code inferred from the destination number. */
	country: CountryCode,

	/** Final SMS content sent to the destination number. */
	content: z.string(),

	/** Segmentation analysis for the rendered SMS content. */
	analysis: APIMessageAnalysis,

	/** Template used to render the message, when applicable. */
	templateId: Snowflake.nullable(),

	/** Timestamp when Rewrite scheduled the message, when applicable. */
	scheduledAt: z.string().nullable(),

	/** Timestamp when Rewrite marked the message as delivered, when applicable. */
	deliveredAt: z.string().nullable(),

	/** Delivery error returned for the message, when applicable. */
	error: MessageError.nullable(),
});

export type WebhookMessagePayload = z.infer<typeof WebhookMessagePayload>;

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export const WebhookSMSOTPEvent = WebhookBase(
	WebhookEventType.SMSOTP,
	WebhookMessagePayload.extend({
		/** OTP data. */
		otp: WebhookOTPMetadata,

		/** The type of the message. Always {@link MessageType.OTP} */
		type: z.literal(MessageType.OTP),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Sent} */
		status: z.literal(MessageStatus.Sent),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export type WebhookSMSOTPEvent = z.infer<typeof WebhookSMSOTPEvent>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-sent */
export const WebhookMessageSentEvent = WebhookBase(
	WebhookEventType.MessageSent,
	WebhookMessagePayload.extend({
		/** The type of the message. Always {@link MessageType.SMS} */
		type: z.literal(MessageType.SMS),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Sent} */
		status: z.literal(MessageStatus.Sent),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-sent */
export type WebhookMessageSentEvent = z.infer<typeof WebhookMessageSentEvent>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-batch */
export const WebhookMessageBatchEvent = WebhookBase(
	WebhookEventType.MessageBatch,
	z.object({
		/** The ID of the project that sent the batch. See {@link Snowflake}. */
		projectId: Snowflake,

		/** Message ID in {@link Snowflake} format. */
		id: Snowflake,

		/**
		 * The IDs of the messages in {@link Snowflake} format that were sent.
		 *
		 * @remarks Can be longer than the original number of request items when some entries were segmented into multiple SMS parts.
		 * @see {@link https://docs.rewritetoday.com/en/webhooks/events/message-batch}
		 */
		ids: z.array(Snowflake),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-batch */
export type WebhookMessageBatchEvent = z.infer<typeof WebhookMessageBatchEvent>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-queued */
export const WebhookMessageQueuedEvent = WebhookBase(
	WebhookEventType.MessageQueued,
	WebhookMessagePayload.extend({
		/** The type of the message. Always {@link MessageType.SMS} */
		type: z.literal(MessageType.SMS),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Queued} */
		status: z.literal(MessageStatus.Queued),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-queued */
export type WebhookMessageQueuedEvent = z.infer<
	typeof WebhookMessageQueuedEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-delivered */
export const WebhookMessageDeliveredEvent = WebhookBase(
	WebhookEventType.MessageDelivered,
	WebhookMessagePayload.extend({
		/** The type of the message. Always {@link MessageType.SMS} */
		type: z.literal(MessageType.SMS),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Delivered} */
		status: z.literal(MessageStatus.Delivered),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-delivered */
export type WebhookMessageDeliveredEvent = z.infer<
	typeof WebhookMessageDeliveredEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-scheduled */
export const WebhookMessageScheduledEvent = WebhookBase(
	WebhookEventType.MessageScheduled,
	WebhookMessagePayload.extend({
		/** Scheduled send time, when the message was delayed intentionally. */
		scheduledAt: z.string(),

		/** The type of the message. Always {@link MessageType.SMS} */
		type: z.literal(MessageType.SMS),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Scheduled} */
		status: z.literal(MessageStatus.Scheduled),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-scheduled */
export type WebhookMessageScheduledEvent = z.infer<
	typeof WebhookMessageScheduledEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-failed */
export const WebhookMessageFailedEvent = WebhookBase(
	WebhookEventType.MessageFailed,
	WebhookMessagePayload.extend({
		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Failed} */
		status: z.literal(MessageStatus.Failed),

		/** The error explaining why the message failed. */
		error: MessageError,
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-failed */
export type WebhookMessageFailedEvent = z.infer<
	typeof WebhookMessageFailedEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-canceled */
export const WebhookMessageCanceledEvent = WebhookBase(
	WebhookEventType.MessageCanceled,
	WebhookMessagePayload.extend({
		/** Scheduled send time, when the message was delayed intentionally. */
		scheduledAt: z.string(),

		/** The type of the message. Always {@link MessageType.SMS} */
		type: z.literal(MessageType.SMS),

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Canceled} */
		status: z.literal(MessageStatus.Canceled),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-canceled */
export type WebhookMessageCanceledEvent = z.infer<
	typeof WebhookMessageCanceledEvent
>;

/** https://docs.rewritetoday.com/en/webhooks */
export const WebhookEvent = z.discriminatedUnion('type', [
	WebhookSMSOTPEvent,
	WebhookMessageSentEvent,
	WebhookMessageBatchEvent,
	WebhookMessageQueuedEvent,
	WebhookMessageDeliveredEvent,
	WebhookMessageScheduledEvent,
	WebhookMessageFailedEvent,
	WebhookMessageCanceledEvent,
]);

/** https://docs.rewritetoday.com/en/webhooks */
export type WebhookEvent = z.infer<typeof WebhookEvent>;

/**
 * Checks whether the event is a {@link WebhookEventType.SMSOTP} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookSMSOTPEvent(
	event: WebhookEvent,
): event is WebhookSMSOTPEvent {
	return event.type === WebhookEventType.SMSOTP;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageSent} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageSentEvent(
	event: WebhookEvent,
): event is WebhookMessageSentEvent {
	return event.type === WebhookEventType.MessageSent;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageBatch} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageBatchEvent(
	event: WebhookEvent,
): event is WebhookMessageBatchEvent {
	return event.type === WebhookEventType.MessageBatch;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageQueued} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageQueuedEvent(
	event: WebhookEvent,
): event is WebhookMessageQueuedEvent {
	return event.type === WebhookEventType.MessageQueued;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageDelivered} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageDeliveredEvent(
	event: WebhookEvent,
): event is WebhookMessageDeliveredEvent {
	return event.type === WebhookEventType.MessageDelivered;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageScheduled} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageScheduledEvent(
	event: WebhookEvent,
): event is WebhookMessageScheduledEvent {
	return event.type === WebhookEventType.MessageScheduled;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageFailed} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageFailedEvent(
	event: WebhookEvent,
): event is WebhookMessageFailedEvent {
	return event.type === WebhookEventType.MessageFailed;
}

/**
 * Checks whether the event is a {@link WebhookEventType.MessageCanceled} or not
 * @param event The event data received from Rewrite
 */
export function isWebhookMessageCanceledEvent(
	event: WebhookEvent,
): event is WebhookMessageCanceledEvent {
	return event.type === WebhookEventType.MessageCanceled;
}
