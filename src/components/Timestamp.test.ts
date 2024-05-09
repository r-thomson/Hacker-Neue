import { subDays, subMinutes } from 'date-fns';
import { afterEach, assert, beforeEach, describe, test, vi } from 'vitest';
import Timestamp from './Timestamp.svelte';

describe('<Timestamp>', () => {
	let container: HTMLElement;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('1969-07-20T20:18:05Z'));

		container = document.createElement('div');
	});

	afterEach(() => {
		vi.useRealTimers();
		container = undefined as any;
	});

	test('renders a single time element', () => {
		new Timestamp({
			target: container,
			props: {
				date: new Date(),
			},
		});

		const nodeList = container.querySelectorAll('time');
		assert.lengthOf(nodeList, 1);
	});

	test('title attribute is absolute timestamp', () => {
		new Timestamp({
			target: container,
			props: {
				date: new Date(),
			},
		});

		const timeEl = container.querySelector('time')!;
		assert.equal(timeEl.getAttribute('title'), 'July 20, 1969 at 8:18 PM');
	});

	test('innerText is relative timestamp for near dates', () => {
		new Timestamp({
			target: container,
			props: {
				date: subMinutes(Date.now(), 5),
			},
		});

		const timeEl = container.querySelector('time')!;
		assert.equal(timeEl.innerText, '5 minutes ago');
	});

	test('innerText is relative timestamp for distant dates', () => {
		new Timestamp({
			target: container,
			props: {
				date: subDays(Date.now(), 10),
			},
		});

		const timeEl = container.querySelector('time')!;
		assert.equal(timeEl.innerText, 'Jul 10, 1969');
	});

	test('datetime attribute is properly formatted', () => {
		new Timestamp({
			target: container,
			props: {
				date: new Date(),
			},
		});

		const timeEl = container.querySelector('time')!;
		assert(timeEl.hasAttribute('datetime'));
		assert.match(
			timeEl.getAttribute('datetime')!,
			// Format example: 1970-04-14T03:08:20Z
			/\d{4,}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}(:\d{2})?)/,
		);
	});
});
