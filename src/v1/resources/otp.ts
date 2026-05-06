import { z } from 'zod';
import { Snowflake } from './globals';

/** https://docs.rewritetoday.com/en/api/openapi-otp.json */
export const APIOTPMessage = z.object({
	id: Snowflake,
	to: z.string(),
	prefix: z.string(),
	createdAt: z.string(),
	expiresAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-otp.json */
export type APIOTPMessage = z.infer<typeof APIOTPMessage>;

/** https://docs.rewritetoday.com/en/api/openapi-otp.json */
export const APIOTPVerification = z.object({
	id: Snowflake,
	valid: z.literal(true),
	verifiedAt: z.string(),
});

/** https://docs.rewritetoday.com/en/api/openapi-otp.json */
export type APIOTPVerification = z.infer<typeof APIOTPVerification>;
