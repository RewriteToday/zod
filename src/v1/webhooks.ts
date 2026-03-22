import { type _ZodType, z } from 'zod';
import { Snowflake } from './resources/globals';
import { APIMessage, MessageStatus, MessageType } from './resources/message';
import { APIOTPMessage } from './resources/otp';
import { WebhookEventType } from './resources/webhooks';

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

export const WebhookSMSOTPEvent = WebhookBase(
	WebhookEventType.SMSOTP,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		projectId: Snowflake,
		otp: APIOTPMessage.pick({
			prefix: true,
			expiresAt: true,
		}),
		type: z.literal(MessageType.OTP),
		status: z.literal(MessageStatus.Sent),
	}),
);

export type WebhookSMSOTPEvent = z.infer<typeof WebhookSMSOTPEvent>;

export const WebhookMessageSentEvent = WebhookBase(
	WebhookEventType.MessageSent,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		projectId: Snowflake,
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Sent),
	}),
);

export type WebhookMessageSentEvent = z.infer<typeof WebhookMessageSentEvent>;

export const WebhookMessageBatchEvent = WebhookBase(
	WebhookEventType.MessageBatch,
	z.object({
		projectId: Snowflake,
		id: Snowflake,
		ids: z.array(Snowflake),
	}),
);

export type WebhookMessageBatchEvent = z.infer<typeof WebhookMessageBatchEvent>;

export const WebhookMessageQueuedEvent = WebhookBase(
	WebhookEventType.MessageQueued,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		projectId: Snowflake,
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Queued),
	}),
);

export type WebhookMessageQueuedEvent = z.infer<
	typeof WebhookMessageQueuedEvent
>;

export const WebhookMessageDeliveredEvent = WebhookBase(
	WebhookEventType.MessageDelivered,
	z.never(),
);

export type WebhookMessageDeliveredEvent = z.infer<
	typeof WebhookMessageDeliveredEvent
>;

export const WebhookMessageScheduledEvent = WebhookBase(
	WebhookEventType.MessageScheduled,
	APIMessage.omit({
		type: true,
		status: true,
		scheduledAt: true,
	}).extend({
		projectId: Snowflake,
		scheduledAt: z.string(),
		type: z.literal(MessageType.SMS),
		status: z.literal(MessageStatus.Scheduled),
	}),
);

export type WebhookMessageScheduledEvent = z.infer<
	typeof WebhookMessageScheduledEvent
>;

export const WebhookMessageFailedEvent = WebhookBase(
	WebhookEventType.MessageFailed,
	APIMessage.omit({
		status: true,
	}).extend({
		projectId: Snowflake,
		status: z.literal(MessageStatus.Failed),
		error: z.object({
			code: z.string(),
			message: z.string(),
		}),
	}),
);

export type WebhookMessageFailedEvent = z.infer<
	typeof WebhookMessageFailedEvent
>;

export const WebhookMessageCanceledEvent = WebhookBase(
	WebhookEventType.MessageCanceled,
	APIMessage.omit({
		type: true,
		status: true,
	}).extend({
		projectId: Snowflake,
	}),
);

export type WebhookMessageCanceledEvent = z.infer<
	typeof WebhookMessageCanceledEvent
>;

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

export type WebhookEvent = z.infer<typeof WebhookEvent>;
