import { z } from 'zod';
import { CountryCode, Snowflake } from './globals';

export const APITemplateVariable = z.object({
	name: z.string(),
	fallback: z.string().optional(),
});

export type APITemplateVariable = z.infer<typeof APITemplateVariable>;

export const APITemplate = z.object({
	id: Snowflake,
	name: z.string(),
	projectId: Snowflake,
	content: z.string(),
	description: z.string().optional(),
	i18n: z.partialRecord(CountryCode, z.string()),
	variables: z.array(APITemplateVariable),
	createdAt: z.string(),
});

export type APITemplate = z.infer<typeof APITemplate>;
