import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

export const WebhookEventType = NamedEnum(
	{
		SMSOTP: 'sms.otp',
		MessageSent: 'message.sent',
		MessageBatch: 'message.batch',
		MessageQueued: 'message.queued',
		MessageDelivered: 'message.delivered',
		MessageScheduled: 'message.scheduled',
		MessageFailed: 'message.failed',
		MessageCanceled: 'message.canceled',
	},
	'https://docs.rewritetoday.com/api-reference/webhooks',
);

export type WebhookEventType = z.infer<typeof WebhookEventType>;

export const WebhookStatus = NamedEnum(
	{
		Active: 'ACTIVE',
		Inactive: 'INACTIVE',
	},
	'https://docs.rewritetoday.com/api-reference/webhooks',
);

export type WebhookStatus = z.infer<typeof WebhookStatus>;

export const APIWebhook = z.object({
	id: Snowflake,
	name: z.string(),
	secret: z.string(),
	endpoint: z.string(),
	events: z.array(WebhookEventType),
	status: WebhookStatus,
	projectId: Snowflake,
	createdAt: z.string(),
});

export type APIWebhook = z.infer<typeof APIWebhook>;
