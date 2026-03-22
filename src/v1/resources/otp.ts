import { z } from 'zod';
import { Snowflake } from './globals';

/**
 * https://docs.rewritetoday.com/api-reference/otp
 */
export const APIOTPMessage = z.object({
	/** OTP message in {@link Snowflake} format. */
	id: Snowflake,

	/** Destination number used for the OTP. */
	to: z.string(),

	/** Brand prefix included in the OTP SMS. */
	prefix: z.string(),

	/** Timestamp when Rewrite accepted the OTP request. */
	createdAt: z.string(),

	/** Timestamp when the OTP becomes invalid. */
	expiresAt: z.string(),
});

/**
 * https://docs.rewritetoday.com/api-reference/otp
 */
export type APIOTPMessage = z.infer<typeof APIOTPMessage>;
