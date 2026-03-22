import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';
import { WebhookEventType } from './webhooks';

export const WebhookDeliveryStatus = NamedEnum(
	{
		Success: 'SUCCESS',
		Failed: 'FAILED',
	},
	'https://docs.rewritetoday.com/api-reference/logs',
);

export type WebhookDeliveryStatus = z.infer<typeof WebhookDeliveryStatus>;

export const APIWebhookLog = z.object({
	id: Snowflake,
	createdAt: z.string(),
	webhookId: Snowflake.nullable(),
	messageId: Snowflake.nullable(),
	type: WebhookEventType,
	error: z.string().nullable(),
	status: WebhookDeliveryStatus,
	url: z.string(),
	code: z.number().nullable(),
	payload: z.record(z.string(), z.unknown()),
	attempt: z.number(),
	latency: z.number().nullable(),
	retryAt: z.string().nullable(),
});

export type APIWebhookLog = z.infer<typeof APIWebhookLog>;
