import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { MetadataValue, Snowflake } from './globals';

/** Request source recorded by Rewrite logs. */
export const RequestLogSource = NamedEnum(
	{
		API: 'API',
		Dashboard: 'Dashboard',
	},
	'https://docs.rewritetoday.com/en/api/openapi-logs.json',
);

/** Request source recorded by Rewrite logs. */
export type RequestLogSource = z.infer<typeof RequestLogSource>;

/** https://docs.rewritetoday.com/en/api/openapi-logs.json */
export const APIRequestLogSummary = z.object({
	id: Snowflake,
	method: z.string(),
	endpoint: z.string(),
	status: z.number(),
	source: RequestLogSource,
	sandbox: z.boolean(),
	createdAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-logs.json */
export type APIRequestLogSummary = z.infer<typeof APIRequestLogSummary>;

/** https://docs.rewritetoday.com/en/api/openapi-logs.json */
export const APIRequestLog = APIRequestLogSummary.extend({
	ip: z.string().nullable(),
	projectId: Snowflake.nullable(),
	apiKeyId: Snowflake.nullable(),
	requestBody: MetadataValue.nullable(),
	responseBody: MetadataValue.nullable(),
});

/** https://docs.rewritetoday.com/en/api/openapi-logs.json */
export type APIRequestLog = z.infer<typeof APIRequestLog>;
