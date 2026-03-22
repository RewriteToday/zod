import { z } from 'zod';
import { Snowflake } from './globals';

export const APIOTPMessage = z.object({
	id: Snowflake,
	to: z.string(),
	prefix: z.string(),
	createdAt: z.string(),
	expiresAt: z.string(),
});

export type APIOTPMessage = z.infer<typeof APIOTPMessage>;
