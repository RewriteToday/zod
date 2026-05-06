import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

/**
 * Shared API key scopes accepted by Rewrite.
 */
export const APIKeyScope = NamedEnum(
	{
		Wildcard: '*',
		ReadProject: 'project:read',
		ReadAPIKeys: 'project:api_keys:read',
		WriteProject: 'project:write',
		ReadWebhooks: 'project:webhooks:read',
		WriteTemplate: 'project:templates:write',
		ReadTemplates: 'project:templates:read',
		WriteWebhooks: 'project:webhooks:write',
		WriteMessages: 'message:write',
		ReadMessages: 'message:read',
		ReadLogs: 'project:logs:read',
	},
	'https://docs.rewritetoday.com/en/api/openapi-api-keys.json',
);

/**
 * Shared API key scopes accepted by Rewrite.
 */
export type APIKeyScope = z.infer<typeof APIKeyScope>;

/**
 * https://docs.rewritetoday.com/en/api/openapi-api-keys.json
 */
export const APIAPIKey = z.object({
	id: Snowflake,
	name: z.string(),
	prefix: z.string(),
	scopes: z.array(APIKeyScope),
	description: z.string().nullable(),
	lastUsedAt: z.string().nullable(),
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/en/api/openapi-api-keys.json
 */
export type APIAPIKey = z.infer<typeof APIAPIKey>;

/**
 * Response payload returned only once when a key is created.
 */
export const APICreatedAPIKey = z.object({
	id: Snowflake,
	key: z.string(),
	createdAt: z.string(),
});

/**
 * Response payload returned only once when a key is created.
 */
export type APICreatedAPIKey = z.infer<typeof APICreatedAPIKey>;
