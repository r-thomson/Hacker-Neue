import type { ParamMatcher } from '@sveltejs/kit';

export type ListParam = 'newest' | 'best' | 'ask' | 'show' | 'jobs' | undefined;

export const match = ((param: string | unknown): param is ListParam => {
	return (
		param === 'newest' ||
		param === 'best' ||
		param === 'ask' ||
		param === 'show' ||
		param === 'jobs'
	);
}) satisfies ParamMatcher;
