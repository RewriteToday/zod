import { z } from 'zod';

/**
 * https://docs.rewritetoday.com/api-reference
 */
export const Snowflake = z
	.string()
	.regex(/^[0-9]{1,32}$/, 'Expected a valid snowflake identifier.')
	.describe(
		'High-scale Rewrite identifier designed to keep every resource traceable across your platform.',
	);

/**
 * https://docs.rewritetoday.com/api-reference
 */
export type Snowflake = z.infer<typeof Snowflake>;

/**
 * https://docs.rewritetoday.com/en/api/pagination
 */
export const Cursor = z
	.object({
		persist: z
			.boolean()
			.describe(
				'Tells you when Rewrite has more results ready for the next smooth fetch.',
			),
		next: Snowflake.optional().describe(
			'Cursor for loading the next page without losing momentum in your integration.',
		),
	})
	.describe(
		'Lean pagination metadata built to move through large Rewrite datasets with ease.',
	);

/**
 * https://docs.rewritetoday.com/en/api/pagination
 */
export type Cursor = z.infer<typeof Cursor>;
