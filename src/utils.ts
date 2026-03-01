import { z } from 'zod';

export const StringEnum = <V extends string>(
	values: readonly [V, ...V[]],
	description: string,
) => z.enum(values).describe(description);

export const HasUniqueItems = <Item>(
	items: readonly Item[],
	getKey: (item: Item) => string,
) => new Set(items.map(getKey)).size === items.length;
