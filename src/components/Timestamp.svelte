<script lang="ts">
	import { differenceInDays, formatISO, intlFormat, intlFormatDistance } from 'date-fns';

	export let date: Date;

	function formatForDisplay(date: Date) {
		const daysAgo = differenceInDays(date, Date.now()) * -1;
		return daysAgo >= 5
			? intlFormat(date, { dateStyle: 'medium' })
			: intlFormatDistance(date, Date.now(), { numeric: 'always' });
	}

	function formatForTitle(date: Date) {
		return intlFormat(date, { dateStyle: 'long', timeStyle: 'short' });
	}
</script>

<time datetime={formatISO(date)} title={formatForTitle(date)}>
	{formatForDisplay(date)}
</time>

<style>
	@media (hover: hover) {
		time[title]:hover {
			text-decoration-line: underline;
			text-decoration-style: dotted;
		}
	}
</style>
