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
	/** Human-readable error message. */
	message: z.string(),

	/** Machine-readable error code. */
	code: z.string(),

	/** Optional detailed error (Only sent in `INVALID_JSON_BODY` code.). */
	detailed: z.record(z.string(), z.unknown()).optional(),
});

const Cursor = z.object({
	/** When `true`, another page is available using the returned cursor values. */
	persist: z.boolean(),

	/** Cursor to request the next page. */
	next: Snowflake.optional(),

	/** Cursor to request the previous page. */
	prev: Snowflake.optional(),
});

const EmptyData = z.null();

const RESTPostSendMessageBaseBody = z.object({
	/** Destination number in E.164 format. */
	to: z.string(),

	/** Optional metadata stored with the message. */
	tags: z.array(APIMessageTag).optional(),

	/** When provided, Rewrite schedules the message for later delivery. */
	scheduledAt: z.string().optional(),

	/** Optional segmentation rules for long SMS bodies. */
	segmentation: z
		.object({
			/** Maximum number of SMS segments Rewrite is allowed to send. */
			max: z.number(),

			/** How Rewrite should behave when the message exceeds the allowed segment count. */
			mode: z.enum(['fail', 'trim', 'send']).optional(),

			/** When `true`, Rewrite may optimize the content to fit GSM-7 when possible. */
			smart: z.boolean().optional(),
		})
		.optional(),
});

/** https://docs.rewritetoday.com/en/api/pagination */
export const RESTCursorOptions = z.object({
	/** The maximum number of items returned per page. */
	limit: z.number().optional(),

	/** Forward cursor in {@link Snowflake} format. */
	after: Snowflake.optional(),

	/** Backward cursor in {@link Snowflake} format. */
	before: Snowflake.optional(),
});

/** https://docs.rewritetoday.com/en/api/pagination */
export type RESTCursorOptions = z.infer<typeof RESTCursorOptions>;

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export const APIResponse = <Schema extends _ZodType>(schema: Schema) =>
	z.discriminatedUnion('ok', [
		z.object({
			/** Indicates a successful response. */
			ok: z.literal(true),

			/** Response payload. */
			data: schema,
		}),
		z.object({
			/** Indicates a failed response. */
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export type APIResponse<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export const APIResponseWithCursor = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('ok', [
		z.object({
			/** Indicates a successful response. */
			ok: z.literal(true),

			/** Response payload. */
			data: schema,

			cursor: Cursor,
		}),
		z.object({
			/** Indicates a failed response. */
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export type APIResponseWithCursor<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponseWithCursor<Schema>>
>;

/** `GET https://api.rewritetoday.com/v1/webhooks/:id`. */
export const RESTGetWebhookData = APIResponse(APIWebhook);

/** `GET https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTGetWebhookData = z.infer<typeof RESTGetWebhookData>;

/** `POST https://api.rewritetoday.com/v1/webhooks`. */
export const RESTPostCreateWebhookData = APIResponse(
	APIWebhook.pick({
		id: true,
		secret: true,
		createdAt: true,
	}),
);

/** `POST https://api.rewritetoday.com/v1/webhooks`. */
export type RESTPostCreateWebhookData = z.infer<
	typeof RESTPostCreateWebhookData
>;

/** `POST https://api.rewritetoday.com/v1/webhooks`. */
export const RESTPostCreateWebhookBody = z.object({
	/** Webhook name. */
	name: APIWebhook.shape.name.optional(),

	/** Destination URL for webhook events. */
	endpoint: APIWebhook.shape.endpoint,

	/** Subscribed events as {@link WebhookEventType}. */
	events: APIWebhook.shape.events,

	/** Secret to use in the webhook requests. */
	secret: z.string().optional(),
});

/** `POST https://api.rewritetoday.com/v1/webhooks`. */
export type RESTPostCreateWebhookBody = z.infer<
	typeof RESTPostCreateWebhookBody
>;

/** `DELETE https://api.rewritetoday.com/v1/webhooks/:id`. */
export const RESTDeleteWebhookData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTDeleteWebhookData = z.infer<typeof RESTDeleteWebhookData>;

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export const RESTPatchUpdateWebhookData = APIResponse(APIWebhook);

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTPatchUpdateWebhookData = z.infer<
	typeof RESTPatchUpdateWebhookData
>;

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export const RESTPatchUpdateWebhookBody = z.object({
	/** Optional webhook name. */
	name: APIWebhook.shape.name.optional(),

	/** Optional webhook endpoint URL. */
	endpoint: APIWebhook.shape.endpoint.optional(),

	/** Optional subscribed events as {@link WebhookEventType}. */
	events: APIWebhook.shape.events.optional(),

	/** Optional status as {@link WebhookStatus}. */
	status: WebhookStatus.optional(),

	/** Optional secret to send in webhook requests. */
	secret: z.string().optional(),
});

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTPatchUpdateWebhookBody = z.infer<
	typeof RESTPatchUpdateWebhookBody
>;

/** `GET https://api.rewritetoday.com/v1/webhooks`. */
export const RESTGetListWebhooksData = APIResponseWithCursor(
	z.array(APIWebhook),
);

/** `GET https://api.rewritetoday.com/v1/webhooks`. */
export type RESTGetListWebhooksData = z.infer<typeof RESTGetListWebhooksData>;

/** `GET https://api.rewritetoday.com/v1/webhooks`. */
export const RESTGetListWebhooksQueryParams = RESTCursorOptions;

/** `GET https://api.rewritetoday.com/v1/webhooks`. */
export type RESTGetListWebhooksQueryParams = z.infer<
	typeof RESTGetListWebhooksQueryParams
>;

/** `GET https://api.rewritetoday.com/v1/templates`. */
export const RESTGetListTemplatesData = APIResponseWithCursor(
	z.array(APITemplate),
);

/** `GET https://api.rewritetoday.com/v1/templates`. */
export type RESTGetListTemplatesData = z.infer<typeof RESTGetListTemplatesData>;

/** `GET https://api.rewritetoday.com/v1/templates`. */
export const RESTGetListTemplatesQueryParams = RESTCursorOptions.extend({
	/** When `true`, include the template `i18n` map in list/detail responses. */
	with18n: z.boolean().optional(),
});

/** `GET https://api.rewritetoday.com/v1/templates`. */
export type RESTGetListTemplatesQueryParams = z.infer<
	typeof RESTGetListTemplatesQueryParams
>;

/** `POST https://api.rewritetoday.com/v1/templates`. */
export const RESTPostCreateTemplateData = APIResponse(
	APITemplate.pick({
		id: true,
		createdAt: true,
	}),
);

/** `POST https://api.rewritetoday.com/v1/templates`. */
export type RESTPostCreateTemplateData = z.infer<
	typeof RESTPostCreateTemplateData
>;

/** `POST https://api.rewritetoday.com/v1/templates`. */
export const RESTPostCreateTemplateBody = z.object({
	name: APITemplate.shape.name,
	content: APITemplate.shape.content,
	variables: APITemplate.shape.variables,
	description: APITemplate.shape.description,

	/** Locale-specific overrides available for the template. */
	i18n: z.partialRecord(CountryCode, z.string()).optional(),
});

/** `POST https://api.rewritetoday.com/v1/templates`. */
export type RESTPostCreateTemplateBody = z.infer<
	typeof RESTPostCreateTemplateBody
>;

/** `PATCH https://api.rewritetoday.com/v1/templates/:id`. */
export const RESTPatchUpdateTemplateData = APIResponse(EmptyData);

/** `PATCH https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTPatchUpdateTemplateData = z.infer<
	typeof RESTPatchUpdateTemplateData
>;

/** `PATCH https://api.rewritetoday.com/v1/templates/:id`. */
export const RESTPatchUpdateTemplateBody = z.object({
	content: RESTPostCreateTemplateBody.shape.content.optional(),
	variables: RESTPostCreateTemplateBody.shape.variables.optional(),
	description: RESTPostCreateTemplateBody.shape.description.optional(),
	i18n: RESTPostCreateTemplateBody.shape.i18n.optional(),
});

/** `PATCH https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTPatchUpdateTemplateBody = z.infer<
	typeof RESTPatchUpdateTemplateBody
>;

/** `DELETE https://api.rewritetoday.com/v1/templates/:id`. */
export const RESTDeleteTemplateData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTDeleteTemplateData = z.infer<typeof RESTDeleteTemplateData>;

/** `GET https://api.rewritetoday.com/v1/templates/:id`. */
export const RESTGetTemplateData = APIResponse(APITemplate);

/** `GET https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTGetTemplateData = z.infer<typeof RESTGetTemplateData>;

/** `DELETE https://api.rewritetoday.com/v1/api-keys/:key`. */
export const RESTDeleteAPIKeyData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/api-keys/:key`. */
export type RESTDeleteAPIKeyData = z.infer<typeof RESTDeleteAPIKeyData>;

/** `GET https://api.rewritetoday.com/v1/logs/:id`. */
export const RESTGetWebhookLogData = APIResponse(APIWebhookLog);

/** `GET https://api.rewritetoday.com/v1/logs/:id`. */
export type RESTGetWebhookLogData = z.infer<typeof RESTGetWebhookLogData>;

/** `GET https://api.rewritetoday.com/v1/webhooks/:id/logs`. */
export const RESTGetListWebhookLogsData = APIResponseWithCursor(
	z.array(
		APIWebhookLog.omit({
			payload: true,
		}),
	),
);

/** `GET https://api.rewritetoday.com/v1/webhooks/:id/logs`. */
export type RESTGetListWebhookLogsData = z.infer<
	typeof RESTGetListWebhookLogsData
>;

/** `GET https://api.rewritetoday.com/v1/webhooks/:id/logs`. */
export const RESTGetListWebhookLogsQueryParams = RESTCursorOptions.extend({
	/** Webhook event type to include in the result set. */
	type: WebhookEventType.optional(),

	/** Delivery status to include in the result set. */
	status: WebhookStatus.optional(),
});

/** `GET https://api.rewritetoday.com/v1/webhooks/:id/logs`. */
export type RESTGetListWebhookLogsQueryParams = z.infer<
	typeof RESTGetListWebhookLogsQueryParams
>;

/** `POST https://api.rewritetoday.com/v1/otp` */
export const RESTPostSendOTPMessageBody = z.object({
	/** Destination number that should receive the OTP. */
	to: z.string(),

	/** Short brand prefix included in the OTP SMS. */
	prefix: z.string().optional(),

	/** Minutes until the OTP expires (Max 15). */
	expiresIn: z.number().optional(),
});

/** `POST https://api.rewritetoday.com/v1/otp` */
export type RESTPostSendOTPMessageBody = z.infer<
	typeof RESTPostSendOTPMessageBody
>;

/** `POST https://api.rewritetoday.com/v1/otp` */
export const RESTPostSendOTPMessageData = APIResponse(APIOTPMessage);

/** `POST https://api.rewritetoday.com/v1/otp` */
export type RESTPostSendOTPMessageData = z.infer<
	typeof RESTPostSendOTPMessageData
>;

/** `POST https://api.rewritetoday.com/v1/otp/:id/verify` */
export const RESTPostVerifyOTPCodeBody = z.object({
	/** Destination number used when the OTP was created. */
	to: z.string(),

	/** Numeric OTP code provided by the user. */
	code: z.string(),
});

/** `POST https://api.rewritetoday.com/v1/otp/:id/verify` */
export type RESTPostVerifyOTPCodeBody = z.infer<
	typeof RESTPostVerifyOTPCodeBody
>;

/** `POST https://api.rewritetoday.com/v1/otp/:id/verify` */
export const RESTPostVerifyOTPCodeData = APIResponse(
	z.object({
		/** OTP identifier being verified. */
		id: z.string(),

		/** Always `true` when the OTP verification succeeds. */
		valid: z.boolean(),

		/** Timestamp when Rewrite marked the OTP as verified. */
		verifiedAt: z.string().nullable(),
	}),
);

/** `POST https://api.rewritetoday.com/v1/otp/:id/verify` */
export type RESTPostVerifyOTPCodeData = z.infer<
	typeof RESTPostVerifyOTPCodeData
>;

/** `POST https://api.rewritetoday.com/v1/messages` */
export const RESTPostSendMessageData = APIResponse(
	APIMessage.pick({
		id: true,
		createdAt: true,
		analysis: true,
	}),
);

/** `POST https://api.rewritetoday.com/v1/messages` */
export type RESTPostSendMessageData = z.infer<typeof RESTPostSendMessageData>;

/** `POST https://api.rewritetoday.com/v1/messages` */
export const RESTPostSendMessageBody = z.union([
	RESTPostSendMessageBaseBody.extend({
		/** Rendered SMS content to send. */
		content: z.string(),
	}).strict(),
	RESTPostSendMessageBaseBody.extend({
		/** Template identifier to render before sending. */
		templateId: Snowflake,

		/** Variable values used when rendering the selected template. */
		variables: z.record(z.string(), z.string()),
	}).strict(),
]);

/** `POST https://api.rewritetoday.com/v1/messages` */
export type RESTPostSendMessageBody = z.infer<typeof RESTPostSendMessageBody>;

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export const RESTPostSendBatchMessagesBody = z.array(RESTPostSendMessageBody);

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export type RESTPostSendBatchMessagesBody = z.infer<
	typeof RESTPostSendBatchMessagesBody
>;

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export const RESTPostSendBatchMessagesData = APIResponse(
	z.object({
		/** Identifiers for the messages accepted into the batch request. */
		ids: z.array(Snowflake),
	}),
);

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export type RESTPostSendBatchMessagesData = z.infer<
	typeof RESTPostSendBatchMessagesData
>;

/** `POST https://api.rewritetoday.com/v1/messages/cancel` */
export const RESTPostCancelMessageData = APIResponse(EmptyData);

/** `POST https://api.rewritetoday.com/v1/messages/cancel` */
export type RESTPostCancelMessageData = z.infer<
	typeof RESTPostCancelMessageData
>;

/** `GET https://api.rewritetoday.com/v1/messages/:id` */
export const RESTGetMessageData = APIResponse(
	APIMessage.omit({
		analysis: true,
	}),
);

/** `GET https://api.rewritetoday.com/v1/messages/:id` */
export type RESTGetMessageData = z.infer<typeof RESTGetMessageData>;

/** `GET https://api.rewritetoday.com/v1/messages` */
export const RESTGetListMessagesQueryParams = RESTCursorOptions.extend({
	/** Filter by message status. */
	status: MessageStatus.optional(),

	/** Lowercase ISO 3166-1 alpha-2 country code inferred from the destination number. */
	country: CountryCode.optional(),
});

/** `GET https://api.rewritetoday.com/v1/messages` */
export type RESTGetListMessagesQueryParams = z.infer<
	typeof RESTGetListMessagesQueryParams
>;

/** `GET https://api.rewritetoday.com/v1/messages` */
export const RESTGetListMessagesData = APIResponseWithCursor(
	z.array(
		APIMessage.omit({
			analysis: true,
		}),
	),
);

/** `GET https://api.rewritetoday.com/v1/messages` */
export type RESTGetListMessagesData = z.infer<typeof RESTGetListMessagesData>;
