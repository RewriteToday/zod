import { z } from 'zod';
import { HasUniqueItems } from '../../utils';
import { Snowflake } from './common';

/**
 * https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export const APIKeyScope = z
	.string()
	.min(1)
	.describe(
		'Granular permission scope that keeps your Rewrite access secure, precise, and production-ready.',
	);

/**
 * https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export type APIKeyScope = z.infer<typeof APIKeyScope>;

/**
 * https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export const APIKey = z
	.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for this API key, ready for clean tracking across every environment.',
		),
		name: z
			.string()
			.min(1)
			.max(32)
			.describe(
				'Clear, team-friendly name that keeps your API keys easy to manage at scale.',
			),
		prefix: z
			.string()
			.min(1)
			.describe(
				'Safe public prefix so your team can recognize the key instantly without exposing the secret.',
			),
		scopes: z
			.array(APIKeyScope)
			.refine((items) => HasUniqueItems(items, (item) => item), {
				message: 'API key scopes must be unique.',
			})
			.describe('Active permissions currently powering this API key.'),
		createdAt: z.coerce
			.date()
			.describe(
				'Precise creation timestamp for confident auditing and lifecycle management.',
			),
	})
	.describe(
		'Complete API key metadata for secure, modern Rewrite integrations. The secret is revealed only once at creation time.',
	);

/**
 * https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export type APIKey = z.infer<typeof APIKey>;
