import { type _ZodType, z } from 'zod';
import { Snowflake } from './resources/globals';
import { APIMessage, MessageStatus, MessageType } from './resources/message';
import { APIOTPMessage } from './resources/otp';
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
		type: z.literal(type),
		data,
		id: Snowflake,
		createdAt: z.string(),
	});

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export const WebhookSMSOTPEvent = WebhookBase(
	WebhookEventType.SMSOTP,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,

		/** OTP data. */
		otp: APIOTPMessage.pick({
			prefix: true,
			expiresAt: true,
		}),

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
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,

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
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
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
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,

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

/**
 * https://docs.rewritetoday.com/en/webhooks/events/message-delivered
 *
 * @wip
 */
export const WebhookMessageDeliveredEvent = WebhookBase(
	WebhookEventType.MessageDelivered,
	z.never(),
);

/**
 * https://docs.rewritetoday.com/en/webhooks/events/message-delivered
 *
 * @wip
 */
export type WebhookMessageDeliveredEvent = z.infer<
	typeof WebhookMessageDeliveredEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-scheduled */
export const WebhookMessageScheduledEvent = WebhookBase(
	WebhookEventType.MessageScheduled,
	APIMessage.omit({
		type: true,
		status: true,
		scheduledAt: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,

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
	APIMessage.omit({
		status: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,

		/** Latest delivery status known by Rewrite. Always {@link MessageStatus.Failed} */
		status: z.literal(MessageStatus.Failed),

		/** The error explaining why the message failed. */
		error: z.object({
			/** A human-readable error code. */
			code: z.string(),

			/** Internal message error. */
			message: z.string(),
		}),
	}),
);

/** https://docs.rewritetoday.com/en/webhooks/events/message-failed */
export type WebhookMessageFailedEvent = z.infer<
	typeof WebhookMessageFailedEvent
>;

/** https://docs.rewritetoday.com/en/webhooks/events/message-canceled */
export const WebhookMessageCanceledEvent = WebhookBase(
	WebhookEventType.MessageCanceled,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		/** The ID of the project that sent the OTP message. See {@link Snowflake}. */
		projectId: Snowflake,
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
