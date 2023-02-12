<script lang="ts">
	import { format, formatDistanceToNowStrict, formatISO } from 'date-fns';

	export let date: Date;
</script>

<time datetime={formatISO(date)} title={format(date, 'PP p')}>
	{formatDistanceToNowStrict(date, { addSuffix: true })}
</time>

<style>
	@media (hover: hover) {
		time:hover {
			text-decoration-line: underline;
			text-decoration-style: dotted;
		}
	}
</style>
