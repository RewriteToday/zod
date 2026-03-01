import { z } from 'zod';
import { HasUniqueItems } from '../../utils';
import { Snowflake } from './common';

const TemplateVariableList = z
	.array(
		z.object({
			name: z
				.string()
				.min(1)
				.max(32)
				.describe(
					'Variable name used to personalize each message with dynamic customer data.',
				),
			fallback: z
				.string()
				.min(1)
				.max(64)
				.describe(
					'Reliable fallback value that keeps your message polished even when data is missing.',
				),
		}),
	)
	.max(15)
	.refine((items) => HasUniqueItems(items, (item) => item.name), {
		message: 'Template variable names must be unique.',
	});

/**
 * https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export const TemplateVariable = TemplateVariableList.element.describe(
	'Reusable personalization token built for rich, dynamic messaging flows.',
);

/**
 * https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export type TemplateVariable = z.infer<typeof TemplateVariable>;

/**
 * https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export const APITemplate = z
	.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for this template, built for fast lookup across your catalog.',
		),
		name: z
			.string()
			.min(1)
			.max(32)
			.describe(
				'Clean template name that keeps your messaging library organized and scalable.',
			),
		content: z
			.string()
			.min(1)
			.max(1024)
			.nullable()
			.optional()
			.describe(
				'Latest approved message copy, ready to power the next send in seconds.',
			),
		variables: TemplateVariableList.nullable()
			.optional()
			.describe(
				'Personalization variables currently configured to make each message feel tailored.',
			),
		createdAt: z.coerce
			.date()
			.describe(
				'Creation timestamp for tracking template rollouts with confidence.',
			),
	})
	.describe(
		'Reusable SMS template metadata built for polished campaigns and scalable customer conversations.',
	);

/**
 * https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export type APITemplate = z.infer<typeof APITemplate>;
