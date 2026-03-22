import { type _ZodType, z } from 'zod';
import { CountryCode, Snowflake } from './resources/globals';
import { APIWebhookLog } from './resources/logs';
import { APIMessage, APIMessageTag, MessageStatus } from './resources/message';
import { APIOTPMessage } from './resources/otp';
import { APITemplate } from './resources/templates';
import {
	APIWebhook,
	WebhookEventType,
	WebhookStatus,
} from './resources/webhooks';

const APIError = z.object({
	message: z.string(),
	code: z.string(),
	detailed: z.record(z.string(), z.unknown()).optional(),
});

const Cursor = z.object({
	persist: z.boolean(),
	next: Snowflake.optional(),
	prev: Snowflake.optional(),
});

const EmptyData = z.null();

const RESTPostSendMessageBaseBody = z.object({
	to: z.string(),
	tags: z.array(APIMessageTag).optional(),
	scheduledAt: z.string().optional(),
	segmentation: z
		.object({
			max: z.number(),
			mode: z.enum(['fail', 'trim', 'send']).optional(),
			smart: z.boolean().optional(),
		})
		.optional(),
});

export const RESTCursorOptions = z.object({
	limit: z.number().optional(),
	after: Snowflake.optional(),
	before: Snowflake.optional(),
});

export type RESTCursorOptions = z.infer<typeof RESTCursorOptions>;

export const APIResponse = <Schema extends _ZodType>(schema: Schema) =>
	z.discriminatedUnion('ok', [
		z.object({
			ok: z.literal(true),
			data: schema,
		}),
		z.object({
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

export type APIResponse<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

export const APIResponseWithCursor = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('ok', [
		z.object({
			ok: z.literal(true),
			data: schema,
			cursor: Cursor,
		}),
		z.object({
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

export type APIResponseWithCursor<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponseWithCursor<Schema>>
>;

export const RESTGetWebhookData = APIResponse(APIWebhook);

export type RESTGetWebhookData = z.infer<typeof RESTGetWebhookData>;

export const RESTPostCreateWebhookData = APIResponse(
	APIWebhook.pick({
		id: true,
		secret: true,
		createdAt: true,
	}),
);

export type RESTPostCreateWebhookData = z.infer<
	typeof RESTPostCreateWebhookData
>;

export const RESTPostCreateWebhookBody = z.object({
	name: APIWebhook.shape.name.optional(),
	endpoint: APIWebhook.shape.endpoint,
	events: APIWebhook.shape.events,
	secret: z.string().optional(),
});

export type RESTPostCreateWebhookBody = z.infer<
	typeof RESTPostCreateWebhookBody
>;

export const RESTDeleteWebhookData = APIResponse(EmptyData);

export type RESTDeleteWebhookData = z.infer<typeof RESTDeleteWebhookData>;

export const RESTPatchUpdateWebhookData = APIResponse(APIWebhook);

export type RESTPatchUpdateWebhookData = z.infer<
	typeof RESTPatchUpdateWebhookData
>;

export const RESTPatchUpdateWebhookBody = z.object({
	name: APIWebhook.shape.name.optional(),
	endpoint: APIWebhook.shape.endpoint.optional(),
	events: APIWebhook.shape.events.optional(),
	status: WebhookStatus.optional(),
	secret: z.string().optional(),
});

export type RESTPatchUpdateWebhookBody = z.infer<
	typeof RESTPatchUpdateWebhookBody
>;

export const RESTGetListWebhooksData = APIResponseWithCursor(
	z.array(APIWebhook),
);

export type RESTGetListWebhooksData = z.infer<typeof RESTGetListWebhooksData>;

export const RESTGetListWebhooksQueryParams = RESTCursorOptions;

export type RESTGetListWebhooksQueryParams = z.infer<
	typeof RESTGetListWebhooksQueryParams
>;

export const RESTGetListTemplatesData = APIResponseWithCursor(
	z.array(APITemplate),
);

export type RESTGetListTemplatesData = z.infer<typeof RESTGetListTemplatesData>;

export const RESTGetListTemplatesQueryParams = RESTCursorOptions.extend({
	with18n: z.boolean().optional(),
});

export type RESTGetListTemplatesQueryParams = z.infer<
	typeof RESTGetListTemplatesQueryParams
>;

export const RESTPostCreateTemplateData = APIResponse(
	APITemplate.pick({
		id: true,
		createdAt: true,
	}),
);

export type RESTPostCreateTemplateData = z.infer<
	typeof RESTPostCreateTemplateData
>;

export const RESTPostCreateTemplateBody = z.object({
	name: APITemplate.shape.name,
	content: APITemplate.shape.content,
	variables: APITemplate.shape.variables,
	description: APITemplate.shape.description,
	i18n: z.partialRecord(CountryCode, z.string()).optional(),
});

export type RESTPostCreateTemplateBody = z.infer<
	typeof RESTPostCreateTemplateBody
>;

export const RESTPatchUpdateTemplateData = APIResponse(EmptyData);

export type RESTPatchUpdateTemplateData = z.infer<
	typeof RESTPatchUpdateTemplateData
>;

export const RESTPatchUpdateTemplateBody = z.object({
	content: RESTPostCreateTemplateBody.shape.content.optional(),
	variables: RESTPostCreateTemplateBody.shape.variables.optional(),
	description: RESTPostCreateTemplateBody.shape.description.optional(),
	i18n: RESTPostCreateTemplateBody.shape.i18n.optional(),
});

export type RESTPatchUpdateTemplateBody = z.infer<
	typeof RESTPatchUpdateTemplateBody
>;

export const RESTDeleteTemplateData = APIResponse(EmptyData);

export type RESTDeleteTemplateData = z.infer<typeof RESTDeleteTemplateData>;

export const RESTGetTemplateData = APIResponse(APITemplate);

export type RESTGetTemplateData = z.infer<typeof RESTGetTemplateData>;

export const RESTDeleteAPIKeyData = APIResponse(EmptyData);

export type RESTDeleteAPIKeyData = z.infer<typeof RESTDeleteAPIKeyData>;

export const RESTGetWebhookLogData = APIResponse(APIWebhookLog);

export type RESTGetWebhookLogData = z.infer<typeof RESTGetWebhookLogData>;

export const RESTGetListWebhookLogsData = APIResponseWithCursor(
	z.array(
		APIWebhookLog.omit({
			payload: true,
		}),
	),
);

export type RESTGetListWebhookLogsData = z.infer<
	typeof RESTGetListWebhookLogsData
>;

export const RESTGetListWebhookLogsQueryParams = RESTCursorOptions.extend({
	type: WebhookEventType.optional(),
	status: WebhookStatus.optional(),
});

export type RESTGetListWebhookLogsQueryParams = z.infer<
	typeof RESTGetListWebhookLogsQueryParams
>;

export const RESTPostSendOTPMessageBody = z.object({
	to: z.string(),
	prefix: z.string().optional(),
	expiresIn: z.number().optional(),
});

export type RESTPostSendOTPMessageBody = z.infer<
	typeof RESTPostSendOTPMessageBody
>;

export const RESTPostSendOTPMessageData = APIResponse(APIOTPMessage);

export type RESTPostSendOTPMessageData = z.infer<
	typeof RESTPostSendOTPMessageData
>;

export const RESTPostVerifyOTPCodeBody = z.object({
	to: z.string(),
	code: z.string(),
});

export type RESTPostVerifyOTPCodeBody = z.infer<
	typeof RESTPostVerifyOTPCodeBody
>;

export const RESTPostVerifyOTPCodeData = APIResponse(
	z.object({
		id: z.string(),
		valid: z.boolean(),
		verifiedAt: z.string().nullable(),
	}),
);

export type RESTPostVerifyOTPCodeData = z.infer<
	typeof RESTPostVerifyOTPCodeData
>;

export const RESTPostSendMessageData = APIResponse(
	APIMessage.pick({
		id: true,
		createdAt: true,
		analysis: true,
	}),
);

export type RESTPostSendMessageData = z.infer<typeof RESTPostSendMessageData>;

export const RESTPostSendMessageBody = z.union([
	RESTPostSendMessageBaseBody.extend({
		content: z.string(),
	}).strict(),
	RESTPostSendMessageBaseBody.extend({
		templateId: Snowflake,
		variables: z.record(z.string(), z.string()),
	}).strict(),
]);

export type RESTPostSendMessageBody = z.infer<typeof RESTPostSendMessageBody>;

export const RESTPostSendBatchMessagesBody = z.array(RESTPostSendMessageBody);

export type RESTPostSendBatchMessagesBody = z.infer<
	typeof RESTPostSendBatchMessagesBody
>;

export const RESTPostSendBatchMessagesData = APIResponse(
	z.object({
		ids: z.array(Snowflake),
	}),
);

export type RESTPostSendBatchMessagesData = z.infer<
	typeof RESTPostSendBatchMessagesData
>;

export const RESTPostCancelMessageData = APIResponse(EmptyData);

export type RESTPostCancelMessageData = z.infer<
	typeof RESTPostCancelMessageData
>;

export const RESTGetMessageData = APIResponse(
	APIMessage.omit({
		analysis: true,
	}),
);

export type RESTGetMessageData = z.infer<typeof RESTGetMessageData>;

export const RESTGetListMessagesQueryParams = RESTCursorOptions.extend({
	status: MessageStatus.optional(),
	country: CountryCode.optional(),
});

export type RESTGetListMessagesQueryParams = z.infer<
	typeof RESTGetListMessagesQueryParams
>;

export const RESTGetListMessagesData = APIResponseWithCursor(
	z.array(
		APIMessage.omit({
			analysis: true,
		}),
	),
);

export type RESTGetListMessagesData = z.infer<typeof RESTGetListMessagesData>;
