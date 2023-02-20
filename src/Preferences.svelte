<script lang="ts">
	import { highlightThreshold, maxStories, showCounters } from './preferences';
</script>

<p>
	A clone of Hacker News made using the
	<a href="https://github.com/HackerNews/API">Hacker News API</a>.
</p>

<form>
	<div class="form-group">
		<label>
			<input type="checkbox" bind:checked={$showCounters} />
			Show post counters
		</label>
	</div>
	<div class="form-group">
		<label class="form-left" for="select_maxStories">Stories per page</label>
		<select bind:value={$maxStories} id="select_maxStories">
			<option value={20}>20</option>
			<option value={30}>30</option>
			<option value={50}>50</option>
			<option value={100}>100</option>
		</select>
	</div>
	<div class="form-group">
		<label class="form-left" for="select_highlightThreshold">Highlight post scores above</label>
		<select bind:value={$highlightThreshold} id="select_highlightThreshold">
			<option value={0}>Never</option>
			<option value={100}>100</option>
			<option value={150}>150</option>
			<option value={200}>200</option>
			<option value={250}>250</option>
			<option value={300}>300</option>
			<option value={350}>350</option>
			<option value={400}>400</option>
			<option value={450}>450</option>
			<option value={500}>500</option>
		</select>
	</div>
</form>

<style>
	.form-group {
		margin: 0.5em 0;
	}

	.form-group > * {
		display: inline-block;
	}

	.form-group .form-left {
		width: 40%;
		padding-right: 1rem;
		text-align: right;
	}

	.form-group > :first-child:not(.form-left),
	.form-group > :not(.form-left) + * {
		margin-left: 40%;
	}

	.form-group :not(.form-left) + :not(.form-left) {
		margin-top: 0.2em;
	}

	form select {
		min-width: 10em;
		margin-left: -0.25em;
	}

	form input[type='checkbox'] {
		vertical-align: 0.08em;
		margin-right: 0.35em;
	}
</style>
