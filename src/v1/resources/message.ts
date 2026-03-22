import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { CountryCode, Snowflake } from './globals';

/** https://docs.rewritetoday.com/api-reference/messages */
export const MessageEncoding = NamedEnum(
	{
		GMS7: 'GMS7',
		UCS2: 'UCS2',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

/** https://docs.rewritetoday.com/api-reference/messages */
export type MessageEncoding = z.infer<typeof MessageEncoding>;

/** https://docs.rewritetoday.com/api-reference/messages */
export const MessageStatus = NamedEnum(
	{
		Sent: 'SENT',
		Queued: 'QUEUED',
		Failed: 'FAILED',
		Canceled: 'CANCELED',
		Scheduled: 'SCHEDULED',
		Delivered: 'DELIVERED',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

/** https://docs.rewritetoday.com/api-reference/messages */
export type MessageStatus = z.infer<typeof MessageStatus>;

/** https://docs.rewritetoday.com/api-reference/messages */
export const MessageType = NamedEnum(
	{
		SMS: 'SMS',
		OTP: 'OTP',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

/** https://docs.rewritetoday.com/api-reference/messages */
export type MessageType = z.infer<typeof MessageType>;

/** https://docs.rewritetoday.com/api-reference/messages */
export const APIMessageTag = z.object({
	/** Tag key attached to the message. */
	name: z.string(),

	/** Tag value attached to the message. */
	value: z.string(),
});

/** https://docs.rewritetoday.com/api-reference/messages */
export type APIMessageTag = z.infer<typeof APIMessageTag>;

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export const MessageAnalysisReason = NamedEnum(
	{
		FitsSingleSegment: 'fits',
		SmartEncodingApplied: 'smart',
		ExceedsSingleSegmentLimit: 'singleLimit',
		ContainsNonGsm7Characters: 'nonGsm7',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export type MessageAnalysisReason = z.infer<typeof MessageAnalysisReason>;

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export const MessageAnalysisEncoding = NamedEnum(
	{
		GSM7: 'gsm7',
		UCS2: 'ucs2',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export type MessageAnalysisEncoding = z.infer<typeof MessageAnalysisEncoding>;

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export const APIMessageAnalysis = z.object({
	/** Total character count in the rendered SMS content. */
	characters: z.number(),

	/** Encoding detected for the rendered SMS content. */
	encoding: MessageAnalysisEncoding,

	/** Segments result. */
	segments: z.object({
		/** Number of SMS segments required to send the message. */
		count: z.number(),

		/** Maximum characters allowed when the message fits in a single SMS. */
		single: z.number(),

		/** Maximum characters allowed per segment in multipart SMS. */
		concat: z.number(),

		/** Why Rewrite selected the reported segmentation result. */
		reason: MessageAnalysisReason,
	}),
});

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export type APIMessageAnalysis = z.infer<typeof APIMessageAnalysis>;

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export const APIMessage = z.object({
	/** Message ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Timestamp when Rewrite accepted the message. */
	createdAt: Snowflake,

	/** Segmentation analysis for the SMS content accepted by Rewrite. */
	analysis: APIMessageAnalysis,

	/** Destination number in E.164 format. */
	to: z.string(),

	/** Message type stored by Rewrite. See {@link MessageType} */
	type: MessageType,

	/** Metadata attached to the message. */
	tags: z.array(APIMessageTag),

	/** Latest delivery status known by Rewrite. See {@link MessageStatus} */
	status: MessageStatus,

	/** Country inferred from the destination number. See {@link CountryCode} */
	country: CountryCode,

	/** Final SMS content sent to the destination number. */
	content: z.string(),

	/** Encoding used by the provider when sending the SMS. See {@link MessageEncoding} */
	encoding: MessageEncoding,

	/** Template used to render the message, when applicable. */
	templateId: Snowflake.nullable(),

	/** Timestamp when the provider confirmed final delivery. */
	deliveredAt: z.string().nullable(),

	/** Scheduled send time, when the message was delayed intentionally. */
	scheduledAt: z.string().nullable(),

	/** Whether the message consumed pay-as-you-go balance instead of subscription quota. */
	isPayAsYouGo: z.boolean(),
});

/**
 * https://docs.rewritetoday.com/api-reference/messages
 */
export type APIMessage = z.infer<typeof APIMessage>;
