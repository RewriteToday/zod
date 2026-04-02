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
export const APITemplateTag = z.object({
	/** Tag name. */
	name: z.string(),

	/** Tag value. */
	value: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export type APITemplateTag = z.infer<typeof APITemplateTag>;

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export const APITemplate = z.object({
	/** Template ID in {@link Snowflake} format. */
	id: Snowflake,

	/** Template name. */
	name: z.string(),

	/** Default SMS content stored for the template. */
	content: z.string(),

	/** Human-readable description saved with the template (1-72 max.). */
	description: z.string().nullable(),

	/** Locale-specific overrides available for the template when requested. */
	i18n: z.partialRecord(CountryCode, z.string()).optional(),

	/** Template variables as {@link APITemplateVariable}. */
	variables: z.array(APITemplateVariable),

	/** Static tags attached to the template. */
	tags: z.array(APITemplateTag),

	/** Timestamp when the template was created. */
	createdAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/templates
 */
export type APITemplate = z.infer<typeof APITemplate>;
