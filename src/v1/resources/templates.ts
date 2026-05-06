import { z } from 'zod';
import { CountryCode, Metadata, Snowflake } from './globals';

/** https://docs.rewritetoday.com/en/api/openapi-templates.json */
export const APITemplateVariable = z.object({
	name: z.string(),
	fallback: z.string().optional(),
});

/** https://docs.rewritetoday.com/en/api/openapi-templates.json */
export type APITemplateVariable = z.infer<typeof APITemplateVariable>;

/** Locale map used by template i18n payloads. */
export const APITemplateI18n = z.partialRecord(CountryCode, z.string());

/** Locale map used by template i18n payloads. */
export type APITemplateI18n = z.infer<typeof APITemplateI18n>;

/** https://docs.rewritetoday.com/en/api/openapi-templates.json */
export const APITemplate = z.object({
	id: Snowflake,
	name: z.string(),
	content: z.string(),
	i18n: APITemplateI18n.optional(),
	variables: z.array(APITemplateVariable),
	description: z.string().nullable(),
	tags: Metadata.optional(),
	createdAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-templates.json */
export type APITemplate = z.infer<typeof APITemplate>;

/** Creation result returned by template create/duplicate endpoints. */
export const APICreatedTemplate = z.object({
	id: Snowflake,
	createdAt: z.string(),
});

/** Creation result returned by template create/duplicate endpoints. */
export type APICreatedTemplate = z.infer<typeof APICreatedTemplate>;
