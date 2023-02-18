<script lang="ts">
	import { counters, maxStories, highlightThreshold } from './preferences';
</script>

<p>
	A clone of Hacker News made using the
	<a href="https://github.com/HackerNews/API">Hacker News API</a>.
</p>

<form>
	<div class="form-group">
		<label>
			<input type="checkbox" bind:checked={$counters} />
			Show post counters
		</label>
	</div>
	<div class="form-group">
		<label class="form-left" for="select_maxStories">Stories per page</label>
		<select bind:value={$maxStories} id="select_maxStories">
			<option>20</option>
			<option>30</option>
			<option>50</option>
			<option>100</option>
		</select>
	</div>
	<div class="form-group">
		<label class="form-left" for="select_highlightThreshold">Highlight post scores above</label>
		<select bind:value={$highlightThreshold} id="select_highlightThreshold">
			<option value="-1">Never</option>
			<option>100</option>
			<option>150</option>
			<option>200</option>
			<option>250</option>
			<option>300</option>
			<option>350</option>
			<option>400</option>
			<option>450</option>
			<option>500</option>
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
