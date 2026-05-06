import { type _ZodType, z } from 'zod';
import { APIAPIKey, APICreatedAPIKey, APIKeyScope } from './resources/apiKeys';
import {
	APIContact,
	APIContactBatchResult,
	APICreatedContact,
} from './resources/contacts';
import { APICompactDelivery, APIDeliverySummary } from './resources/deliveries';
import { Metadata, Snowflake } from './resources/globals';
import { APIRequestLog, APIRequestLogSummary } from './resources/logs';
import {
	APIBatchMessagesResult,
	APICreatedMessage,
	APIMessage,
	MessageEncoding,
	MessageSegmentationMode,
	MessageStatus,
	MessageType,
} from './resources/message';
import { APIOTPMessage, APIOTPVerification } from './resources/otp';
import { APISegment } from './resources/segments';
import { APICreatedTag, APITag } from './resources/tags';
import {
	APICreatedTemplate,
	APITemplate,
	APITemplateI18n,
	APITemplateVariable,
} from './resources/templates';
import {
	APIWebhookDelivery,
	APIWebhookSummary,
	APIWebhookWithSecret,
	WebhookDeliveryStatus,
	WebhookEventSelection,
	WebhookEventType,
} from './resources/webhooks';
import {
	WebhookEvent,
	WebhookMessageBatchEvent,
	WebhookMessageCanceledEvent,
	WebhookMessageDeliveredEvent,
	WebhookMessageFailedEvent,
	WebhookMessageQueuedEvent,
	WebhookMessageReceivedEvent,
	WebhookMessageScheduledEvent,
	WebhookMessageSentEvent,
	WebhookSMSOTPEvent,
} from './webhooks';

const APIError = z.object({
	message: z.string(),
	code: z.string(),
	detailed: z.object({}).catchall(z.unknown()).optional(),
});

const Cursor = z.object({
	persist: z.boolean(),
	next: Snowflake.optional(),
	prev: Snowflake.optional(),
});

const EmptyData = z.null();

/** https://docs.rewritetoday.com/en/api/pagination */
export const RESTCursorOptions = z.object({
	limit: z.number().optional(),
	after: Snowflake.optional(),
	before: Snowflake.optional(),
});

/** https://docs.rewritetoday.com/en/api/pagination */
export type RESTCursorOptions = z.infer<typeof RESTCursorOptions>;

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
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
			ok: z.literal(true),
			data: schema,
			cursor: Cursor,
		}),
		z.object({
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export type APIResponseWithCursor<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponseWithCursor<Schema>>
>;

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export const APIResponseWithCursorAndCount = <Schema extends _ZodType>(
	schema: Schema,
) =>
	z.discriminatedUnion('ok', [
		z.object({
			ok: z.literal(true),
			data: schema,
			cursor: Cursor,
			count: z.number().optional(),
		}),
		z.object({
			ok: z.literal(false),
			error: APIError.optional(),
		}),
	]);

/** https://docs.rewritetoday.com/en/api/introduction#response-conventions */
export type APIResponseWithCursorAndCount<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponseWithCursorAndCount<Schema>>
>;

export const RESTDeleteManyBody = z.object({
	ids: z.array(Snowflake),
});

export type RESTDeleteManyBody = z.infer<typeof RESTDeleteManyBody>;

export const RESTDeleteManyData = APIResponse(z.array(Snowflake));

export type RESTDeleteManyData = z.infer<typeof RESTDeleteManyData>;

export const RESTGetListAPIKeysQueryParams = RESTCursorOptions;

export type RESTGetListAPIKeysQueryParams = z.infer<
	typeof RESTGetListAPIKeysQueryParams
>;

export const RESTGetListWebhooksQueryParams = RESTCursorOptions;

export type RESTGetListWebhooksQueryParams = z.infer<
	typeof RESTGetListWebhooksQueryParams
>;

export const RESTGetListAPIKeysData = APIResponseWithCursor(z.array(APIAPIKey));

export type RESTGetListAPIKeysData = z.infer<typeof RESTGetListAPIKeysData>;

export const RESTGetAPIKeyData = APIResponse(APIAPIKey);

export type RESTGetAPIKeyData = z.infer<typeof RESTGetAPIKeyData>;

export const RESTPostCreateAPIKeyData = APIResponse(APICreatedAPIKey);

export type RESTPostCreateAPIKeyData = z.infer<typeof RESTPostCreateAPIKeyData>;

export const RESTPostCreateAPIKeyBody = z.object({
	name: z.string(),
	description: z.string().optional(),
	scopes: z.array(APIKeyScope).optional(),
});

export type RESTPostCreateAPIKeyBody = z.infer<typeof RESTPostCreateAPIKeyBody>;

export const RESTPatchUpdateAPIKeyData = APIResponse(EmptyData);

export type RESTPatchUpdateAPIKeyData = z.infer<
	typeof RESTPatchUpdateAPIKeyData
>;

export const RESTPatchUpdateAPIKeyBody = z.object({
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	scopes: z.array(APIKeyScope).optional(),
});

export type RESTPatchUpdateAPIKeyBody = z.infer<
	typeof RESTPatchUpdateAPIKeyBody
>;

export const RESTDeleteAPIKeyData = APIResponse(EmptyData);

export type RESTDeleteAPIKeyData = z.infer<typeof RESTDeleteAPIKeyData>;

export const RESTDeleteAPIKeysData = RESTDeleteManyData;

export type RESTDeleteAPIKeysData = z.infer<typeof RESTDeleteAPIKeysData>;

export const RESTGetContactData = APIResponse(APIContact);

export type RESTGetContactData = z.infer<typeof RESTGetContactData>;

export const RESTGetListContactsData = APIResponseWithCursor(
	z.array(APIContact),
);

export type RESTGetListContactsData = z.infer<typeof RESTGetListContactsData>;

export const RESTGetListContactsQueryParams = RESTCursorOptions;

export type RESTGetListContactsQueryParams = z.infer<
	typeof RESTGetListContactsQueryParams
>;

export const RESTPostCreateContactData = APIResponse(APICreatedContact);

export type RESTPostCreateContactData = z.infer<
	typeof RESTPostCreateContactData
>;

export const RESTPostCreateContactBody = z.object({
	phone: z.string(),
	name: z.string().optional(),
	channel: MessageType.optional(),
	tagIds: z.array(Snowflake).optional(),
	tags: Metadata.optional(),
	preferredLanguages: z.array(z.string()).optional(),
});

export type RESTPostCreateContactBody = z.infer<
	typeof RESTPostCreateContactBody
>;

export const RESTPatchUpdateContactData = APIResponse(EmptyData);

export type RESTPatchUpdateContactData = z.infer<
	typeof RESTPatchUpdateContactData
>;

export const RESTPatchUpdateContactBody = RESTPostCreateContactBody.partial();

export type RESTPatchUpdateContactBody = z.infer<
	typeof RESTPatchUpdateContactBody
>;

export const RESTDeleteContactData = APIResponse(EmptyData);

export type RESTDeleteContactData = z.infer<typeof RESTDeleteContactData>;

export const RESTDeleteContactsData = RESTDeleteManyData;

export type RESTDeleteContactsData = z.infer<typeof RESTDeleteContactsData>;

export const RESTPostBatchContactsBody = z.object({
	contacts: z.array(RESTPostCreateContactBody),
	upsert: z.boolean().optional(),
});

export type RESTPostBatchContactsBody = z.infer<
	typeof RESTPostBatchContactsBody
>;

export const RESTPostBatchContactsData = APIResponse(APIContactBatchResult);

export type RESTPostBatchContactsData = z.infer<
	typeof RESTPostBatchContactsData
>;

export const RESTPostAttachContactTagsBody = z.object({
	ids: z.array(Snowflake),
});

export type RESTPostAttachContactTagsBody = z.infer<
	typeof RESTPostAttachContactTagsBody
>;

export const RESTPostAttachContactTagsData = APIResponse(EmptyData);

export type RESTPostAttachContactTagsData = z.infer<
	typeof RESTPostAttachContactTagsData
>;

export const RESTDeleteDetachContactTagsBody = RESTPostAttachContactTagsBody;

export type RESTDeleteDetachContactTagsBody = z.infer<
	typeof RESTDeleteDetachContactTagsBody
>;

export const RESTDeleteDetachContactTagsData = APIResponse(EmptyData);

export type RESTDeleteDetachContactTagsData = z.infer<
	typeof RESTDeleteDetachContactTagsData
>;

export const RESTGetSegmentData = APIResponse(APISegment);

export type RESTGetSegmentData = z.infer<typeof RESTGetSegmentData>;

export const RESTGetListSegmentsData = APIResponseWithCursor(
	z.array(APISegment),
);

export type RESTGetListSegmentsData = z.infer<typeof RESTGetListSegmentsData>;

export const RESTGetListSegmentsQueryParams = RESTCursorOptions;

export type RESTGetListSegmentsQueryParams = z.infer<
	typeof RESTGetListSegmentsQueryParams
>;

export const RESTPostCreateSegmentData = APIResponse(APISegment);

export type RESTPostCreateSegmentData = z.infer<
	typeof RESTPostCreateSegmentData
>;

export const RESTPostCreateSegmentBody = z.object({
	name: z.string(),
	color: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
});

export type RESTPostCreateSegmentBody = z.infer<
	typeof RESTPostCreateSegmentBody
>;

export const RESTPatchUpdateSegmentData = APIResponse(EmptyData);

export type RESTPatchUpdateSegmentData = z.infer<
	typeof RESTPatchUpdateSegmentData
>;

export const RESTPatchUpdateSegmentBody = RESTPostCreateSegmentBody.partial();

export type RESTPatchUpdateSegmentBody = z.infer<
	typeof RESTPatchUpdateSegmentBody
>;

export const RESTDeleteSegmentData = APIResponse(EmptyData);

export type RESTDeleteSegmentData = z.infer<typeof RESTDeleteSegmentData>;

export const RESTDeleteSegmentsData = RESTDeleteManyData;

export type RESTDeleteSegmentsData = z.infer<typeof RESTDeleteSegmentsData>;

export const RESTGetListSegmentContactsData = APIResponseWithCursor(
	z.array(APIContact),
);

export type RESTGetListSegmentContactsData = z.infer<
	typeof RESTGetListSegmentContactsData
>;

export const RESTGetListSegmentContactsQueryParams = RESTCursorOptions;

export type RESTGetListSegmentContactsQueryParams = z.infer<
	typeof RESTGetListSegmentContactsQueryParams
>;

export const RESTPostAttachSegmentContactBody = z.object({
	contactId: Snowflake,
});

export type RESTPostAttachSegmentContactBody = z.infer<
	typeof RESTPostAttachSegmentContactBody
>;

export const RESTPostAttachSegmentContactData = APIResponse(EmptyData);

export type RESTPostAttachSegmentContactData = z.infer<
	typeof RESTPostAttachSegmentContactData
>;

export const RESTPostAttachSegmentContactsBody = z.object({
	ids: z.array(Snowflake),
});

export type RESTPostAttachSegmentContactsBody = z.infer<
	typeof RESTPostAttachSegmentContactsBody
>;

export const RESTPostAttachSegmentContactsData = APIResponse(EmptyData);

export type RESTPostAttachSegmentContactsData = z.infer<
	typeof RESTPostAttachSegmentContactsData
>;

export const RESTPostDetachSegmentContactsBody = z.object({
	ids: z.array(Snowflake),
});

export type RESTPostDetachSegmentContactsBody = z.infer<
	typeof RESTPostDetachSegmentContactsBody
>;

export const RESTPostDetachSegmentContactsData = APIResponse(EmptyData);

export type RESTPostDetachSegmentContactsData = z.infer<
	typeof RESTPostDetachSegmentContactsData
>;

export const RESTDeleteDetachSegmentContactData = APIResponse(EmptyData);

export type RESTDeleteDetachSegmentContactData = z.infer<
	typeof RESTDeleteDetachSegmentContactData
>;

export const RESTPostSendOTPMessageData = APIResponse(APIOTPMessage);

export type RESTPostSendOTPMessageData = z.infer<
	typeof RESTPostSendOTPMessageData
>;

export const RESTPostSendOTPPhoneMessageBody = z
	.object({
		to: z.string(),
		prefix: z.string().optional(),
		expiresIn: z.number().optional(),
		contact: z.never().optional(),
	})
	.strict();

export type RESTPostSendOTPPhoneMessageBody = z.infer<
	typeof RESTPostSendOTPPhoneMessageBody
>;

export const RESTPostSendOTPContactMessageBody = z
	.object({
		contact: z.string(),
		prefix: z.string().optional(),
		expiresIn: z.number().optional(),
		to: z.never().optional(),
	})
	.strict();

export type RESTPostSendOTPContactMessageBody = z.infer<
	typeof RESTPostSendOTPContactMessageBody
>;

export const RESTPostSendOTPMessageBody = z.union([
	RESTPostSendOTPPhoneMessageBody,
	RESTPostSendOTPContactMessageBody,
]);

export type RESTPostSendOTPMessageBody = z.infer<
	typeof RESTPostSendOTPMessageBody
>;

export const RESTPostVerifyOTPCodeBody = z.object({
	to: z.string(),
	code: z.string(),
});

export type RESTPostVerifyOTPCodeBody = z.infer<
	typeof RESTPostVerifyOTPCodeBody
>;

export const RESTPostVerifyOTPCodeData = APIResponse(APIOTPVerification);

export type RESTPostVerifyOTPCodeData = z.infer<
	typeof RESTPostVerifyOTPCodeData
>;

export const RESTGetListTagsData = APIResponse(z.array(APITag));

export type RESTGetListTagsData = z.infer<typeof RESTGetListTagsData>;

export const RESTGetTagData = APIResponse(APITag);

export type RESTGetTagData = z.infer<typeof RESTGetTagData>;

export const RESTPostCreateTagData = APIResponse(APICreatedTag);

export type RESTPostCreateTagData = z.infer<typeof RESTPostCreateTagData>;

export const RESTPostCreateTagBody = z.object({
	name: z.string(),
	color: z.string().optional(),
	description: z.string().optional(),
});

export type RESTPostCreateTagBody = z.infer<typeof RESTPostCreateTagBody>;

export const RESTPatchUpdateTagData = APIResponse(EmptyData);

export type RESTPatchUpdateTagData = z.infer<typeof RESTPatchUpdateTagData>;

export const RESTPatchUpdateTagBody = z.object({
	name: z.string().optional(),
	color: z.string().optional(),
	description: z.string().optional(),
});

export type RESTPatchUpdateTagBody = z.infer<typeof RESTPatchUpdateTagBody>;

export const RESTDeleteTagData = APIResponse(EmptyData);

export type RESTDeleteTagData = z.infer<typeof RESTDeleteTagData>;

export const RESTGetListTemplatesData = APIResponseWithCursor(
	z.array(APITemplate),
);

export type RESTGetListTemplatesData = z.infer<typeof RESTGetListTemplatesData>;

export const RESTGetListTemplatesQueryParams = RESTCursorOptions.extend({
	withi18n: z.boolean().optional(),
});

export type RESTGetListTemplatesQueryParams = z.infer<
	typeof RESTGetListTemplatesQueryParams
>;

export const RESTGetTemplateQueryParams = z.object({
	withi18n: z.boolean().optional(),
});

export type RESTGetTemplateQueryParams = z.infer<
	typeof RESTGetTemplateQueryParams
>;

export const RESTGetTemplateData = APIResponse(APITemplate);

export type RESTGetTemplateData = z.infer<typeof RESTGetTemplateData>;

export const RESTPostCreateTemplateData = APIResponse(APICreatedTemplate);

export type RESTPostCreateTemplateData = z.infer<
	typeof RESTPostCreateTemplateData
>;

export const RESTPostCreateTemplateBody = z.object({
	name: z.string(),
	content: z.string(),
	variables: z.array(APITemplateVariable),
	description: z.string().nullable().optional(),
	tags: Metadata.optional(),
});

export type RESTPostCreateTemplateBody = z.infer<
	typeof RESTPostCreateTemplateBody
>;

export const RESTPatchUpdateTemplateData = APIResponse(EmptyData);

export type RESTPatchUpdateTemplateData = z.infer<
	typeof RESTPatchUpdateTemplateData
>;

export const RESTPatchUpdateTemplateBody = z.object({
	content: z.string().optional(),
	variables: z.array(APITemplateVariable).optional(),
	description: z.string().nullable().optional(),
	tags: Metadata.optional(),
});

export type RESTPatchUpdateTemplateBody = z.infer<
	typeof RESTPatchUpdateTemplateBody
>;

export const RESTDeleteTemplateData = APIResponse(EmptyData);

export type RESTDeleteTemplateData = z.infer<typeof RESTDeleteTemplateData>;

export const RESTDeleteTemplatesData = RESTDeleteManyData;

export type RESTDeleteTemplatesData = z.infer<typeof RESTDeleteTemplatesData>;

export const RESTPostDuplicateTemplateBody = z.object({
	name: z.string().optional(),
});

export type RESTPostDuplicateTemplateBody = z.infer<
	typeof RESTPostDuplicateTemplateBody
>;

export const RESTPostDuplicateTemplateData = APIResponse(APICreatedTemplate);

export type RESTPostDuplicateTemplateData = z.infer<
	typeof RESTPostDuplicateTemplateData
>;

export const RESTGetListWebhooksData = APIResponseWithCursor(
	z.array(APIWebhookSummary),
);

export type RESTGetListWebhooksData = z.infer<typeof RESTGetListWebhooksData>;

export const RESTGetWebhookData = APIResponse(APIWebhookWithSecret);

export type RESTGetWebhookData = z.infer<typeof RESTGetWebhookData>;

export const RESTPostCreateWebhookData = APIResponse(
	z.object({
		id: Snowflake,
		secret: z.string(),
		createdAt: z.string(),
		sandbox: z.boolean(),
	}),
);

export type RESTPostCreateWebhookData = z.infer<
	typeof RESTPostCreateWebhookData
>;

export const RESTPostCreateWebhookBody = z.object({
	name: z.string().optional(),
	events: z.array(WebhookEventSelection),
	secret: z.string().optional(),
	endpoint: z.string(),
	delivery: APIWebhookDelivery.optional(),
});

export type RESTPostCreateWebhookBody = z.infer<
	typeof RESTPostCreateWebhookBody
>;

export const RESTPatchUpdateWebhookData = APIResponse(EmptyData);

export type RESTPatchUpdateWebhookData = z.infer<
	typeof RESTPatchUpdateWebhookData
>;

export const RESTPatchUpdateWebhookBody = z.object({
	name: z.string().nullable().optional(),
	events: z.array(WebhookEventSelection).optional(),
	secret: z.string().optional(),
	endpoint: z.string().optional(),
	isEnabled: z.boolean().optional(),
	delivery: APIWebhookDelivery.optional(),
});

export type RESTPatchUpdateWebhookBody = z.infer<
	typeof RESTPatchUpdateWebhookBody
>;

export const RESTDeleteWebhookData = APIResponse(EmptyData);

export type RESTDeleteWebhookData = z.infer<typeof RESTDeleteWebhookData>;

export const RESTDeleteWebhooksData = RESTDeleteManyData;

export type RESTDeleteWebhooksData = z.infer<typeof RESTDeleteWebhooksData>;

export const RESTGetLogData = APIResponse(APIRequestLog);

export type RESTGetLogData = z.infer<typeof RESTGetLogData>;

export const RESTGetListLogsData = APIResponseWithCursor(
	z.array(APIRequestLogSummary),
);

export type RESTGetListLogsData = z.infer<typeof RESTGetListLogsData>;

export const RESTGetListLogsQueryParams = RESTCursorOptions.extend({
	code: z.number().optional(),
	method: z.string().optional(),
	endpoint: z.string().optional(),
});

export type RESTGetListLogsQueryParams = z.infer<
	typeof RESTGetListLogsQueryParams
>;

export const RESTGetListAPIKeyLogsQueryParams = RESTGetListLogsQueryParams;

export type RESTGetListAPIKeyLogsQueryParams = z.infer<
	typeof RESTGetListAPIKeyLogsQueryParams
>;

export const RESTGetListAPIKeyLogsData = RESTGetListLogsData;

export type RESTGetListAPIKeyLogsData = z.infer<
	typeof RESTGetListAPIKeyLogsData
>;

export const APIWebhookLog = APIDeliverySummary.extend({
	payload: WebhookEvent,
	webhookId: Snowflake.nullable(),
});

export type APIWebhookLog = z.infer<typeof APIWebhookLog>;

export const APIWebhookLogSummary = APIDeliverySummary;

export type APIWebhookLogSummary = z.infer<typeof APIWebhookLogSummary>;

export const RESTGetDeliveryData = APIResponse(APIWebhookLog);

export type RESTGetDeliveryData = z.infer<typeof RESTGetDeliveryData>;

export const RESTGetListDeliveriesData = APIResponseWithCursor(
	z.array(APICompactDelivery),
);

export type RESTGetListDeliveriesData = z.infer<
	typeof RESTGetListDeliveriesData
>;

export const RESTGetListDeliveriesQueryParams = RESTCursorOptions.extend({
	webhookId: Snowflake.optional(),
	messageId: Snowflake.optional(),
	type: WebhookEventType.optional(),
});

export type RESTGetListDeliveriesQueryParams = z.infer<
	typeof RESTGetListDeliveriesQueryParams
>;

export const RESTGetListWebhookDeliveriesData = APIResponseWithCursor(
	z.array(APIDeliverySummary),
);

export type RESTGetListWebhookDeliveriesData = z.infer<
	typeof RESTGetListWebhookDeliveriesData
>;

export const RESTGetListWebhookDeliveriesQueryParams = RESTCursorOptions.extend(
	{
		type: WebhookEventType.optional(),
		status: WebhookDeliveryStatus.optional(),
		code: z.number().optional(),
		attempt: z.number().optional(),
		messageId: Snowflake.optional(),
	},
);

export type RESTGetListWebhookDeliveriesQueryParams = z.infer<
	typeof RESTGetListWebhookDeliveriesQueryParams
>;

export const RESTGetWebhookLogData = RESTGetDeliveryData;

export type RESTGetWebhookLogData = z.infer<typeof RESTGetWebhookLogData>;

export const RESTGetListWebhookLogsData = RESTGetListWebhookDeliveriesData;

export type RESTGetListWebhookLogsData = z.infer<
	typeof RESTGetListWebhookLogsData
>;

export const RESTGetListWebhookLogsQueryParams =
	RESTGetListWebhookDeliveriesQueryParams;

export type RESTGetListWebhookLogsQueryParams = z.infer<
	typeof RESTGetListWebhookLogsQueryParams
>;

export const RESTMessageSegmentation = z.object({
	max: z.number(),
	mode: MessageSegmentationMode.optional(),
	smart: z.boolean().optional(),
});

export type RESTMessageSegmentation = z.infer<typeof RESTMessageSegmentation>;

const RESTMessageBaseBody = z.object({
	tags: Metadata.optional(),
	scheduledAt: z.string().optional(),
	segmentation: RESTMessageSegmentation.optional(),
});

export const RESTMessageInlineBody = RESTMessageBaseBody.extend({
	to: z.string(),
	content: z.string(),
}).strict();

export type RESTMessageInlineBody = z.infer<typeof RESTMessageInlineBody>;

export const RESTMessageInlineContactBody = RESTMessageBaseBody.extend({
	contact: z.string(),
	content: z.string(),
}).strict();

export type RESTMessageInlineContactBody = z.infer<
	typeof RESTMessageInlineContactBody
>;

const RESTMessageTemplateBaseBody = RESTMessageBaseBody.extend({
	templateId: Snowflake,
	variables: z.record(z.string(), z.string()).optional(),
});

export const RESTMessageTemplateBody = RESTMessageTemplateBaseBody.extend({
	to: z.string(),
}).strict();

export type RESTMessageTemplateBody = z.infer<typeof RESTMessageTemplateBody>;

export const RESTMessageTemplateContactBody =
	RESTMessageTemplateBaseBody.extend({
		contact: z.string(),
	}).strict();

export type RESTMessageTemplateContactBody = z.infer<
	typeof RESTMessageTemplateContactBody
>;

export const RESTPostSendMessageBody = z.union([
	RESTMessageInlineBody,
	RESTMessageInlineContactBody,
	RESTMessageTemplateBody,
	RESTMessageTemplateContactBody,
]);

export type RESTPostSendMessageBody = z.infer<typeof RESTPostSendMessageBody>;

export const RESTPostSendMessageData = APIResponse(APICreatedMessage);

export type RESTPostSendMessageData = z.infer<typeof RESTPostSendMessageData>;

export const RESTPostSendBatchMessagesBody = z.array(RESTPostSendMessageBody);

export type RESTPostSendBatchMessagesBody = z.infer<
	typeof RESTPostSendBatchMessagesBody
>;

export const RESTPostSendBatchMessagesData = APIResponse(
	APIBatchMessagesResult,
);

export type RESTPostSendBatchMessagesData = z.infer<
	typeof RESTPostSendBatchMessagesData
>;

export const RESTPostCancelMessageData = APIResponse(EmptyData);

export type RESTPostCancelMessageData = z.infer<
	typeof RESTPostCancelMessageData
>;

export const RESTGetMessageData = APIResponse(APIMessage);

export type RESTGetMessageData = z.infer<typeof RESTGetMessageData>;

export const RESTGetListMessagesQueryParams = RESTCursorOptions.extend({
	status: MessageStatus.optional(),
	country: z.string().optional(),
	encoding: MessageEncoding.optional(),
	scheduled: z.boolean().optional(),
	withCounts: z.boolean().optional(),
});

export type RESTGetListMessagesQueryParams = z.infer<
	typeof RESTGetListMessagesQueryParams
>;

export const RESTGetListMessagesData = APIResponseWithCursorAndCount(
	z.array(APIMessage),
);

export type RESTGetListMessagesData = z.infer<typeof RESTGetListMessagesData>;

export const RESTPostCreateMessageBody = RESTPostSendMessageBody;

export type RESTPostCreateMessageBody = z.infer<
	typeof RESTPostCreateMessageBody
>;

export const RESTPostCreateMessageData = RESTPostSendMessageData;

export type RESTPostCreateMessageData = z.infer<
	typeof RESTPostCreateMessageData
>;

export const RESTPostCreateMessagesBatchBody = RESTPostSendBatchMessagesBody;

export type RESTPostCreateMessagesBatchBody = z.infer<
	typeof RESTPostCreateMessagesBatchBody
>;

export const RESTPostCreateMessagesBatchData = RESTPostSendBatchMessagesData;

export type RESTPostCreateMessagesBatchData = z.infer<
	typeof RESTPostCreateMessagesBatchData
>;

export const RESTPostCreateOTPBody = RESTPostSendOTPMessageBody;

export type RESTPostCreateOTPBody = z.infer<typeof RESTPostCreateOTPBody>;

export const RESTPostCreateOTPData = RESTPostSendOTPMessageData;

export type RESTPostCreateOTPData = z.infer<typeof RESTPostCreateOTPData>;

export const RESTPostVerifyOTPBody = RESTPostVerifyOTPCodeBody;

export type RESTPostVerifyOTPBody = z.infer<typeof RESTPostVerifyOTPBody>;

export const RESTPostVerifyOTPData = RESTPostVerifyOTPCodeData;

export type RESTPostVerifyOTPData = z.infer<typeof RESTPostVerifyOTPData>;

export const APITemplateLocaleMap = APITemplateI18n;

export type APITemplateLocaleMap = z.infer<typeof APITemplateLocaleMap>;

export const APIMessageCreateResponse = APICreatedMessage;

export type APIMessageCreateResponse = z.infer<typeof APIMessageCreateResponse>;

export const APIMessageBatchCreateResponse = APIBatchMessagesResult;

export type APIMessageBatchCreateResponse = z.infer<
	typeof APIMessageBatchCreateResponse
>;

export const APIOTPCreateResponseData = APIOTPMessage;

export type APIOTPCreateResponseData = z.infer<typeof APIOTPCreateResponseData>;

export const APIOTPVerifyResponseData = APIOTPVerification;

export type APIOTPVerifyResponseData = z.infer<typeof APIOTPVerifyResponseData>;

export const APIWebhookEvent = WebhookEvent;

export type APIWebhookEvent = z.infer<typeof APIWebhookEvent>;

export const APIWebhookEventData = z.union([
	WebhookSMSOTPEvent.shape.data,
	WebhookMessageSentEvent.shape.data,
	WebhookMessageBatchEvent.shape.data,
	WebhookMessageQueuedEvent.shape.data,
	WebhookMessageFailedEvent.shape.data,
	WebhookMessageCanceledEvent.shape.data,
	WebhookMessageDeliveredEvent.shape.data,
	WebhookMessageReceivedEvent.shape.data,
	WebhookMessageScheduledEvent.shape.data,
]);

export type APIWebhookEventData = z.infer<typeof APIWebhookEventData>;
