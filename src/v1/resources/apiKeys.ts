import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

/**
 * https://docs.rewritetoday.com/api-reference/api-keys
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
	'https://docs.rewritetoday.com/api-reference/api-keys',
);

/**
 * https://docs.rewritetoday.com/api-reference/api-keys
 */
export type APIKeyScope = z.infer<typeof APIKeyScope>;

/**
 * https://docs.rewritetoday.com/api-reference/api-keys
 */
export const APIAPIKey = z.object({
	/** API key ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Display name of the API key (1-32 max). */
	name: z.string(),

	/** Project ID in {@link Snowflake} format. */
	projectId: Snowflake,

	/** Allowed scopes for this key. */
	scopes: z.array(APIKeyScope),

	/** Prefix used in the API key. */
	prefix: z.string(),

	/** Timestamp when the API key was last used (~5 minutes late). */
	lastUsedAt: z.string().optional(),

	/** Optional description of the API key (1-62 max). */
	description: z.string().optional(),

	/** Timestamp when Rewrite created the API key. */
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/api-keys
 */
export type APIAPIKey = z.infer<typeof APIAPIKey>;
