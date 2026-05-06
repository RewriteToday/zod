import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { CountryCode, Metadata, Snowflake } from './globals';

/** Stored message kind. */
export const MessageType = NamedEnum(
	{
		SMS: 'SMS',
		OTP: 'OTP',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** Stored message kind. */
export type MessageType = z.infer<typeof MessageType>;

/** Stored SMS encoding. */
export const MessageEncoding = NamedEnum(
	{
		GSM7: 'GSM7',
		UCS2: 'UCS2',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** Stored SMS encoding. */
export type MessageEncoding = z.infer<typeof MessageEncoding>;

/** Latest message state known by Rewrite. */
export const MessageStatus = NamedEnum(
	{
		Sent: 'SENT',
		Queued: 'QUEUED',
		Failed: 'FAILED',
		Canceled: 'CANCELED',
		Received: 'RECEIVED',
		Scheduled: 'SCHEDULED',
		Delivered: 'DELIVERED',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** Latest message state known by Rewrite. */
export type MessageStatus = z.infer<typeof MessageStatus>;

/** How Rewrite may handle long SMS bodies. */
export const MessageSegmentationMode = NamedEnum(
	{
		Fail: 'fail',
		Trim: 'trim',
		Send: 'send',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** How Rewrite may handle long SMS bodies. */
export type MessageSegmentationMode = z.infer<typeof MessageSegmentationMode>;

/** Analysis-time encoding inferred by Rewrite. */
export const MessageAnalysisEncoding = NamedEnum(
	{
		GSM7: 'gsm7',
		UCS2: 'ucs2',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** Analysis-time encoding inferred by Rewrite. */
export type MessageAnalysisEncoding = z.infer<typeof MessageAnalysisEncoding>;

/** Why Rewrite chose the reported segmentation result. */
export const MessageAnalysisReason = NamedEnum(
	{
		FitsSingleSegment: 'fits',
		SmartEncodingApplied: 'smart',
		ExceedsSingleSegmentLimit: 'singleLimit',
		ContainsNonGsm7Characters: 'nonGsm7',
	},
	'https://docs.rewritetoday.com/en/api/openapi-messages.json',
);

/** Why Rewrite chose the reported segmentation result. */
export type MessageAnalysisReason = z.infer<typeof MessageAnalysisReason>;

/** Error metadata embedded in message webhooks. */
export const MessageError = z.object({
	code: z.union([z.string(), z.number(), z.null()]),
	message: z.string(),
});

/** Error metadata embedded in message webhooks. */
export type MessageError = z.infer<typeof MessageError>;

/** Segment sizing reported by Rewrite. */
export const APIMessageAnalysisSegments = z.object({
	count: z.number(),
	single: z.number(),
	concat: z.number(),
	reason: MessageAnalysisReason,
});

/** Segment sizing reported by Rewrite. */
export type APIMessageAnalysisSegments = z.infer<
	typeof APIMessageAnalysisSegments
>;

/** Segmentation analysis returned by Rewrite. */
export const APIMessageAnalysis = z.object({
	characters: z.number(),
	encoding: MessageAnalysisEncoding,
	segments: APIMessageAnalysisSegments,
});

/** Segmentation analysis returned by Rewrite. */
export type APIMessageAnalysis = z.infer<typeof APIMessageAnalysis>;

/** High-level message reference returned by creation endpoints. */
export const APIMessageRef = z.object({
	id: Snowflake,
	createdAt: z.string(),
});

/** High-level message reference returned by creation endpoints. */
export type APIMessageRef = z.infer<typeof APIMessageRef>;

/** Message creation result returned by Rewrite. */
export const APICreatedMessage = APIMessageRef.extend({
	analysis: APIMessageAnalysis,
	sandbox: z.boolean(),
});

/** Message creation result returned by Rewrite. */
export type APICreatedMessage = z.infer<typeof APICreatedMessage>;

/** Batch message creation result returned by Rewrite. */
export const APIBatchMessagesResult = z.object({
	ids: z.array(Snowflake),
});

/** Batch message creation result returned by Rewrite. */
export type APIBatchMessagesResult = z.infer<typeof APIBatchMessagesResult>;

/** Persisted message representation returned by Rewrite. */
export const APIMessage = z.object({
	id: Snowflake,
	createdAt: z.string(),
	contact: z.string().nullable(),
	contactId: Snowflake.nullable(),
	to: z.string(),
	from: z.string().nullable(),
	type: MessageType,
	tags: Metadata,
	status: MessageStatus,
	country: CountryCode,
	content: z.string(),
	encoding: MessageEncoding,
	templateId: Snowflake.nullable(),
	deliveredAt: z.string().nullable(),
	scheduledAt: z.string().nullable(),
	sandbox: z.boolean(),
});

/** Persisted message representation returned by Rewrite. */
export type APIMessage = z.infer<typeof APIMessage>;
