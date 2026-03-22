import { z } from 'zod';

export const StringEnum = <V extends string>(
	values: readonly [V, ...V[]],
	description: string,
) => z.enum(values).describe(description);

export const NamedEnum = <const Values extends Record<string, string>>(
	values: Values,
	description: string,
) =>
	Object.assign(
		z
			.enum(
				Object.values(values) as [
					Values[keyof Values],
					...Values[keyof Values][],
				],
			)
			.describe(description),
		values,
	);
