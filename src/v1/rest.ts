import { type _ZodType, z } from 'zod';
import { APIContact } from './resources/contacts';
import { CountryCode, Snowflake } from './resources/globals';
import {
	APIWebhookLog,
	APIWebhookLogSummary,
	WebhookDeliveryStatus,
} from './resources/logs';
import {
	APIMessage,
	APIMessageTag,
	MessageStatus,
	MessageType,
} from './resources/message';
import { APIOTPMessage } from './resources/otp';
import { APISegment } from './resources/segments';
import { APITemplate, APITemplateTag } from './resources/templates';
import {
	APIWebhook,
	APIWebhookDelivery,
	APIWebhookSummary,
	WebhookEventSelection,
	WebhookEventType,
	WebhookStatus,
} from './resources/webhooks';

const APIError = z.object({
	/** Human-readable error message. */
	message: z.string(),

	/** Machine-readable error code. */
	code: z.string(),

	/** Optional detailed error (Only sent in `INVALID_JSON_BODY` code.). */
	detailed: z.object({}).catchall(z.unknown()).optional(),
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

const RESTMessagePhoneTargetBody = {
	/** Destination number in E.164 format. */
	to: z.string(),

	/** Contact identifier or name target is not allowed when `to` is provided. */
	contact: z.never().optional(),
};

const RESTMessageContactTargetBody = {
	/** Contact identifier or name used to resolve the destination number. */
	contact: z.string(),

	/** Direct phone targets are not allowed when `contact` is provided. */
	to: z.never().optional(),
};

const RESTMessageContentBody = {
	/** Rendered SMS content to send. */
	content: z.string(),

	/** Template identifiers are not allowed when raw content is provided. */
	templateId: z.never().optional(),

	/** Variables are not allowed when raw content is provided. */
	variables: z.never().optional(),
};

const RESTMessageTemplateBody = {
	/** Template identifier to render before sending. */
	templateId: Snowflake,

	/** Variable values used when rendering the selected template. */
	variables: z.record(z.string(), z.string()).optional(),

	/** Raw content is not allowed when a template is provided. */
	content: z.never().optional(),
};

const RESTMessageCreateResponse = APIMessage.pick({
	id: true,
	createdAt: true,
	analysis: true,
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

/** `GET https://api.rewritetoday.com/v1/contacts/:identifier`. */
export const RESTGetContactData = APIResponse(APIContact);

/** `GET https://api.rewritetoday.com/v1/contacts/:identifier`. */
export type RESTGetContactData = z.infer<typeof RESTGetContactData>;

/** `GET https://api.rewritetoday.com/v1/contacts`. */
export const RESTGetListContactsData = APIResponseWithCursor(
	z.array(APIContact),
);

/** `GET https://api.rewritetoday.com/v1/contacts`. */
export type RESTGetListContactsData = z.infer<typeof RESTGetListContactsData>;

/** `GET https://api.rewritetoday.com/v1/contacts`. */
export const RESTGetListContactsQueryParams = RESTCursorOptions;

/** `GET https://api.rewritetoday.com/v1/contacts`. */
export type RESTGetListContactsQueryParams = z.infer<
	typeof RESTGetListContactsQueryParams
>;

/** `POST https://api.rewritetoday.com/v1/contacts`. */
export const RESTPostCreateContactData = APIResponse(
	APIContact.pick({
		id: true,
		phone: true,
		country: true,
		createdAt: true,
	}),
);

/** `POST https://api.rewritetoday.com/v1/contacts`. */
export type RESTPostCreateContactData = z.infer<
	typeof RESTPostCreateContactData
>;

/** `POST https://api.rewritetoday.com/v1/contacts`. */
export const RESTPostCreateContactBody = z.object({
	/** Contact number in E.164 format. */
	phone: z.string(),

	/** Optional contact name. */
	name: z.string().optional(),

	/** Optional preferred channel for the contact. */
	channel: MessageType.optional(),

	/** Arbitrary metadata stored with the contact. */
	tags: z.object({}).catchall(z.unknown()).optional(),
});

/** `POST https://api.rewritetoday.com/v1/contacts`. */
export type RESTPostCreateContactBody = z.infer<
	typeof RESTPostCreateContactBody
>;

/** `PATCH https://api.rewritetoday.com/v1/contacts/:id`. */
export const RESTPatchUpdateContactData = APIResponse(EmptyData);

/** `PATCH https://api.rewritetoday.com/v1/contacts/:id`. */
export type RESTPatchUpdateContactData = z.infer<
	typeof RESTPatchUpdateContactData
>;

/** `PATCH https://api.rewritetoday.com/v1/contacts/:id`. */
export const RESTPatchUpdateContactBody = RESTPostCreateContactBody.partial();

/** `PATCH https://api.rewritetoday.com/v1/contacts/:id`. */
export type RESTPatchUpdateContactBody = z.infer<
	typeof RESTPatchUpdateContactBody
>;

/** `DELETE https://api.rewritetoday.com/v1/contacts/:id`. */
export const RESTDeleteContactData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/contacts/:id`. */
export type RESTDeleteContactData = z.infer<typeof RESTDeleteContactData>;

/** `GET https://api.rewritetoday.com/v1/segments/:id`. */
export const RESTGetSegmentData = APIResponse(APISegment);

/** `GET https://api.rewritetoday.com/v1/segments/:id`. */
export type RESTGetSegmentData = z.infer<typeof RESTGetSegmentData>;

/** `GET https://api.rewritetoday.com/v1/segments`. */
export const RESTGetListSegmentsData = APIResponseWithCursor(
	z.array(APISegment),
);

/** `GET https://api.rewritetoday.com/v1/segments`. */
export type RESTGetListSegmentsData = z.infer<typeof RESTGetListSegmentsData>;

/** `GET https://api.rewritetoday.com/v1/segments`. */
export const RESTGetListSegmentsQueryParams = RESTCursorOptions;

/** `GET https://api.rewritetoday.com/v1/segments`. */
export type RESTGetListSegmentsQueryParams = z.infer<
	typeof RESTGetListSegmentsQueryParams
>;

/** `POST https://api.rewritetoday.com/v1/segments`. */
export const RESTPostCreateSegmentData = APIResponse(APISegment);

/** `POST https://api.rewritetoday.com/v1/segments`. */
export type RESTPostCreateSegmentData = z.infer<
	typeof RESTPostCreateSegmentData
>;

/** `POST https://api.rewritetoday.com/v1/segments`. */
export const RESTPostCreateSegmentBody = z.object({
	/** Segment name. */
	name: z.string(),

	/** Optional HEX color associated with the segment. */
	color: z.string().nullable().optional(),

	/** Optional segment description. */
	description: z.string().nullable().optional(),
});

/** `POST https://api.rewritetoday.com/v1/segments`. */
export type RESTPostCreateSegmentBody = z.infer<
	typeof RESTPostCreateSegmentBody
>;

/** `PATCH https://api.rewritetoday.com/v1/segments/:id`. */
export const RESTPatchUpdateSegmentData = APIResponse(EmptyData);

/** `PATCH https://api.rewritetoday.com/v1/segments/:id`. */
export type RESTPatchUpdateSegmentData = z.infer<
	typeof RESTPatchUpdateSegmentData
>;

/** `PATCH https://api.rewritetoday.com/v1/segments/:id`. */
export const RESTPatchUpdateSegmentBody = RESTPostCreateSegmentBody.partial();

/** `PATCH https://api.rewritetoday.com/v1/segments/:id`. */
export type RESTPatchUpdateSegmentBody = z.infer<
	typeof RESTPatchUpdateSegmentBody
>;

/** `DELETE https://api.rewritetoday.com/v1/segments/:id`. */
export const RESTDeleteSegmentData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/segments/:id`. */
export type RESTDeleteSegmentData = z.infer<typeof RESTDeleteSegmentData>;

/** `GET https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export const RESTGetListSegmentContactsData = APIResponseWithCursor(
	z.array(APIContact),
);

/** `GET https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export type RESTGetListSegmentContactsData = z.infer<
	typeof RESTGetListSegmentContactsData
>;

/** `GET https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export const RESTGetListSegmentContactsQueryParams = RESTCursorOptions;

/** `GET https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export type RESTGetListSegmentContactsQueryParams = z.infer<
	typeof RESTGetListSegmentContactsQueryParams
>;

/** `POST https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export const RESTPostAttachSegmentContactBody = z.object({
	/** Contact identifier to attach to the segment. */
	contactId: Snowflake,
});

/** `POST https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export type RESTPostAttachSegmentContactBody = z.infer<
	typeof RESTPostAttachSegmentContactBody
>;

/** `POST https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export const RESTPostAttachSegmentContactData = APIResponse(EmptyData);

/** `POST https://api.rewritetoday.com/v1/segments/:id/contacts`. */
export type RESTPostAttachSegmentContactData = z.infer<
	typeof RESTPostAttachSegmentContactData
>;

/** `DELETE https://api.rewritetoday.com/v1/segments/:id/contacts/:contactId`. */
export const RESTDeleteDetachSegmentContactData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/segments/:id/contacts/:contactId`. */
export type RESTDeleteDetachSegmentContactData = z.infer<
	typeof RESTDeleteDetachSegmentContactData
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
	/** Optional webhook name. */
	name: z.string().optional(),

	/** Destination URL for webhook events. */
	endpoint: APIWebhook.shape.endpoint,

	/** Subscribed webhook events. */
	events: z.array(WebhookEventSelection),

	/** Optional secret to use in webhook deliveries. */
	secret: z.string().optional(),

	/** Optional delivery overrides. */
	delivery: APIWebhookDelivery.partial().optional(),
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
export const RESTPatchUpdateWebhookData = APIResponse(EmptyData);

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTPatchUpdateWebhookData = z.infer<
	typeof RESTPatchUpdateWebhookData
>;

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export const RESTPatchUpdateWebhookBody = z.object({
	/** Optional webhook name. */
	name: z.string().nullable().optional(),

	/** Optional destination URL for webhook events. */
	endpoint: APIWebhook.shape.endpoint.optional(),

	/** Optional set of subscribed webhook events. */
	events: z.array(WebhookEventSelection).optional(),

	/** Optional status. */
	status: WebhookStatus.optional(),

	/** Optional secret to use in webhook deliveries. */
	secret: z.string().optional(),

	/** Optional delivery overrides. */
	delivery: APIWebhookDelivery.partial().optional(),
});

/** `PATCH https://api.rewritetoday.com/v1/webhooks/:id`. */
export type RESTPatchUpdateWebhookBody = z.infer<
	typeof RESTPatchUpdateWebhookBody
>;

/** `GET https://api.rewritetoday.com/v1/webhooks`. */
export const RESTGetListWebhooksData = APIResponseWithCursor(
	z.array(APIWebhookSummary),
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
	/** When `true`, include the template `i18n` map in responses. */
	withi18n: z.boolean().optional(),
});

/** `GET https://api.rewritetoday.com/v1/templates`. */
export type RESTGetListTemplatesQueryParams = z.infer<
	typeof RESTGetListTemplatesQueryParams
>;

/** `GET https://api.rewritetoday.com/v1/templates/:identifier`. */
export const RESTGetTemplateQueryParams = z.object({
	/** When `true`, include the template `i18n` map in the response. */
	withi18n: z.boolean().optional(),
});

/** `GET https://api.rewritetoday.com/v1/templates/:identifier`. */
export type RESTGetTemplateQueryParams = z.infer<
	typeof RESTGetTemplateQueryParams
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

	/** Optional description saved with the template. */
	description: APITemplate.shape.description.optional(),

	/** Optional static tags attached to the template. */
	tags: z.array(APITemplateTag).optional(),
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
export const RESTPatchUpdateTemplateBody = RESTPostCreateTemplateBody.omit({
	name: true,
}).partial();

/** `PATCH https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTPatchUpdateTemplateBody = z.infer<
	typeof RESTPatchUpdateTemplateBody
>;

/** `DELETE https://api.rewritetoday.com/v1/templates/:id`. */
export const RESTDeleteTemplateData = APIResponse(EmptyData);

/** `DELETE https://api.rewritetoday.com/v1/templates/:id`. */
export type RESTDeleteTemplateData = z.infer<typeof RESTDeleteTemplateData>;

/** `GET https://api.rewritetoday.com/v1/templates/:identifier`. */
export const RESTGetTemplateData = APIResponse(APITemplate);

/** `GET https://api.rewritetoday.com/v1/templates/:identifier`. */
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
	z.array(APIWebhookLogSummary),
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
	status: WebhookDeliveryStatus.optional(),
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
		valid: z.literal(true),

		/** Timestamp when Rewrite marked the OTP as verified. */
		verifiedAt: z.string(),
	}),
);

/** `POST https://api.rewritetoday.com/v1/otp/:id/verify` */
export type RESTPostVerifyOTPCodeData = z.infer<
	typeof RESTPostVerifyOTPCodeData
>;

/** `POST https://api.rewritetoday.com/v1/messages` */
export const RESTPostSendMessageBody = z.union([
	RESTPostSendMessageBaseBody.extend({
		...RESTMessagePhoneTargetBody,
		...RESTMessageContentBody,
	}).strict(),
	RESTPostSendMessageBaseBody.extend({
		...RESTMessagePhoneTargetBody,
		...RESTMessageTemplateBody,
	}).strict(),
	RESTPostSendMessageBaseBody.extend({
		...RESTMessageContactTargetBody,
		...RESTMessageContentBody,
	}).strict(),
	RESTPostSendMessageBaseBody.extend({
		...RESTMessageContactTargetBody,
		...RESTMessageTemplateBody,
	}).strict(),
]);

/** `POST https://api.rewritetoday.com/v1/messages` */
export type RESTPostSendMessageBody = z.infer<typeof RESTPostSendMessageBody>;

/** `POST https://api.rewritetoday.com/v1/messages` */
export const RESTPostSendMessageData = APIResponse(RESTMessageCreateResponse);

/** `POST https://api.rewritetoday.com/v1/messages` */
export type RESTPostSendMessageData = z.infer<typeof RESTPostSendMessageData>;

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export const RESTPostSendBatchMessagesBody = z.array(RESTPostSendMessageBody);

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export type RESTPostSendBatchMessagesBody = z.infer<
	typeof RESTPostSendBatchMessagesBody
>;

/** `POST https://api.rewritetoday.com/v1/messages/batch` */
export const RESTPostSendBatchMessagesData = APIResponse(
	z.array(RESTMessageCreateResponse),
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
