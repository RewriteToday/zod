import type { RESTCursorOptions } from './rest';

type QueryParamValue = boolean | number | string | undefined;

export const createQuery = <Options extends object>(options?: Options) => {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(
		(options ?? {}) as Record<string, QueryParamValue>,
	)) {
		if (value !== undefined) params.set(key, String(value));
	}

	return params.toString();
};

export const createCursorQuery = <Options extends RESTCursorOptions>(
	{ limit = 15, ...options }: Options = {} as Options,
) =>
	createQuery({
		limit,
		...(options as Record<string, QueryParamValue>),
	});
