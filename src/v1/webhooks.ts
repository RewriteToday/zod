import { type _ZodType, z } from 'zod';
import { CountryCode, Metadata, Snowflake } from './resources/globals';
import {
	APIMessageAnalysis,
	MessageError,
	MessageStatus,
	MessageType,
} from './resources/message';
import { WebhookEventType } from './resources/webhooks';

const WebhookBase = <
	Type extends z.infer<typeof WebhookEventType>,
	Schema extends _ZodType,
>(
	type: Type,
	data: Schema,
) =>
	z.object({
		id: Snowflake,
		createdAt: z.string(),
		type: z.literal(type),
		sandbox: z.boolean(),
		data,
	});

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export const WebhookOTPMetadata = z.object({
	prefix: z.string(),
	expiresIn: z.number(),
	expiresAt: z.string(),
});

/** https://docs.rewritetoday.com/en/webhooks/events/sms-otp */
export type WebhookOTPMetadata = z.infer<typeof WebhookOTPMetadata>;

export const WebhookMessagePayload = z.object({
	id: Snowflake,
	projectId: Snowflake,
	contact: z.string().nullable(),
	contactId: Snowflake.nullable(),
	to: z.string(),
	tags: Metadata,
	sandbox: z.boolean(),
	type: MessageType,
	status: MessageStatus,
	content: z.string(),
	country: CountryCode,
	analysis: APIMessageAnalysis,
	error: MessageError.nullable(),
	deliveredAt: z.string().nullable(),
	scheduledAt: z.string().nullable(),
	templateId: Snowflake.nullable(),
	otp: WebhookOTPMetadata.optional(),
});

export type WebhookMessagePayload = z.infer<typeof WebhookMessagePayload>;

export const WebhookBatchPayload = z.object({
	id: Snowflake,
	projectId: Snowflake,
	ids: z.array(Snowflake),
});

export type WebhookBatchPayload = z.infer<typeof WebhookBatchPayload>;

export const WebhookSMSOTPEvent = WebhookBase(
	WebhookEventType.SMSOTP,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.OTP),
		status: z.literal(MessageStatus.Sent),
		otp: WebhookOTPMetadata,
	}),
);

export type WebhookSMSOTPEvent = z.infer<typeof WebhookSMSOTPEvent>;

export const WebhookMessageSentEvent = WebhookBase(
	WebhookEventType.MessageSent,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Sent),
	}),
);

export type WebhookMessageSentEvent = z.infer<typeof WebhookMessageSentEvent>;

export const WebhookMessageBatchEvent = WebhookBase(
	WebhookEventType.MessageBatch,
	WebhookBatchPayload,
);

export type WebhookMessageBatchEvent = z.infer<typeof WebhookMessageBatchEvent>;

export const WebhookMessageQueuedEvent = WebhookBase(
	WebhookEventType.MessageQueued,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Queued),
	}),
);

export type WebhookMessageQueuedEvent = z.infer<
	typeof WebhookMessageQueuedEvent
>;

export const WebhookMessageFailedEvent = WebhookBase(
	WebhookEventType.MessageFailed,
	WebhookMessagePayload.extend({
		status: z.literal(MessageStatus.Failed),
		error: MessageError,
	}),
);

export type WebhookMessageFailedEvent = z.infer<
	typeof WebhookMessageFailedEvent
>;

export const WebhookMessageCanceledEvent = WebhookBase(
	WebhookEventType.MessageCanceled,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Canceled),
	}),
);

export type WebhookMessageCanceledEvent = z.infer<
	typeof WebhookMessageCanceledEvent
>;

export const WebhookMessageDeliveredEvent = WebhookBase(
	WebhookEventType.MessageDelivered,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Delivered),
	}),
);

export type WebhookMessageDeliveredEvent = z.infer<
	typeof WebhookMessageDeliveredEvent
>;

export const WebhookMessageReceivedEvent = WebhookBase(
	WebhookEventType.MessageReceived,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Received),
	}),
);

export type WebhookMessageReceivedEvent = z.infer<
	typeof WebhookMessageReceivedEvent
>;

export const WebhookMessageScheduledEvent = WebhookBase(
	WebhookEventType.MessageScheduled,
	WebhookMessagePayload.extend({
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Scheduled),
	}),
);

export type WebhookMessageScheduledEvent = z.infer<
	typeof WebhookMessageScheduledEvent
>;

/** https://docs.rewritetoday.com/en/webhooks */
export const WebhookEvent = z.discriminatedUnion('type', [
	WebhookSMSOTPEvent,
	WebhookMessageSentEvent,
	WebhookMessageBatchEvent,
	WebhookMessageQueuedEvent,
	WebhookMessageFailedEvent,
	WebhookMessageCanceledEvent,
	WebhookMessageDeliveredEvent,
	WebhookMessageReceivedEvent,
	WebhookMessageScheduledEvent,
]);

/** https://docs.rewritetoday.com/en/webhooks */
export type WebhookEvent = z.infer<typeof WebhookEvent>;

export function isWebhookSMSOTPEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.SMSOTP;
}

export function isWebhookMessageSentEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageSent;
}

export function isWebhookMessageBatchEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageBatch;
}

export function isWebhookMessageQueuedEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageQueued;
}

export function isWebhookMessageFailedEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageFailed;
}

export function isWebhookMessageCanceledEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageCanceled;
}

export function isWebhookMessageDeliveredEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageDelivered;
}

export function isWebhookMessageReceivedEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageReceived;
}

export function isWebhookMessageScheduledEvent(event: WebhookEvent) {
	return event.type === WebhookEventType.MessageScheduled;
}
