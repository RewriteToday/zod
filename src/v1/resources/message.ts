import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { CountryCode, Snowflake } from './globals';

export const MessageEncoding = NamedEnum(
	{
		GMS7: 'GMS7',
		UCS2: 'UCS2',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

export type MessageEncoding = z.infer<typeof MessageEncoding>;

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

export type MessageStatus = z.infer<typeof MessageStatus>;

export const MessageType = NamedEnum(
	{
		SMS: 'SMS',
		OTP: 'OTP',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

export type MessageType = z.infer<typeof MessageType>;

export const APIMessageTag = z.object({
	name: z.string(),
	value: z.string(),
});

export type APIMessageTag = z.infer<typeof APIMessageTag>;

export const MessageAnalysisReason = NamedEnum(
	{
		FitsSingleSegment: 'fits',
		SmartEncodingApplied: 'smart',
		ExceedsSingleSegmentLimit: 'singleLimit',
		ContainsNonGsm7Characters: 'nonGsm7',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

export type MessageAnalysisReason = z.infer<typeof MessageAnalysisReason>;

export const MessageAnalysisEncoding = NamedEnum(
	{
		GSM7: 'gsm7',
		UCS2: 'ucs2',
	},
	'https://docs.rewritetoday.com/api-reference/messages',
);

export type MessageAnalysisEncoding = z.infer<typeof MessageAnalysisEncoding>;

export const APIMessageAnalysis = z.object({
	characters: z.number(),
	encoding: MessageAnalysisEncoding,
	segments: z.object({
		count: z.number(),
		single: z.number(),
		concat: z.number(),
		reason: MessageAnalysisReason,
	}),
});

export type APIMessageAnalysis = z.infer<typeof APIMessageAnalysis>;

export const APIMessage = z.object({
	id: Snowflake,
	createdAt: Snowflake,
	analysis: APIMessageAnalysis,
	to: z.string(),
	type: MessageType,
	tags: z.array(APIMessageTag),
	status: MessageStatus,
	country: CountryCode,
	content: z.string(),
	encoding: MessageEncoding,
	templateId: Snowflake.nullable(),
	deliveredAt: z.string().nullable(),
	scheduledAt: z.string().nullable(),
	isPayAsYouGo: z.boolean(),
});

export type APIMessage = z.infer<typeof APIMessage>;
