import { z } from 'zod';
import { CountryCode, Snowflake } from './globals';

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export const APITemplateVariable = z.object({
	/** Variable name. */
	name: z.string(),

	/** Optional default value. */
	fallback: z.string().optional(),
});

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export type APITemplateVariable = z.infer<typeof APITemplateVariable>;

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export const APITemplate = z.object({
	/** Template ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Template name. */
	name: z.string(),

	/** Project ID in {@link Snowflake} format. */
	projectId: Snowflake,

	/** Default SMS content stored for the template. */
	content: z.string(),

	/** Human-readable description saved with the template (1-72 max.). */
	description: z.string().optional(),

	/** Locale-specific overrides available for the template. */
	i18n: z.partialRecord(CountryCode, z.string()),

	/** Template variables as {@link APITemplateVariable}. */
	variables: z.array(APITemplateVariable),

	/** Timestamp when the template was created. */
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export type APITemplate = z.infer<typeof APITemplate>;
