import { z } from 'zod';
import { NamedEnum } from '../../utils';
import { Snowflake } from './globals';

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

export type APIKeyScope = z.infer<typeof APIKeyScope>;

export const APIAPIKey = z.object({
	id: Snowflake,
	name: z.string(),
	projectId: Snowflake,
	scopes: z.array(APIKeyScope),
	prefix: z.string(),
	lastUsedAt: z.string().optional(),
	description: z.string().optional(),
	createdAt: z.string(),
});

export type APIAPIKey = z.infer<typeof APIAPIKey>;
