<script lang="ts">
	export let error: Error;
</script>

<div class="container">
	<pre class="ascii-art">
           ____________________
   _..--""||                   |
  /       ||  _______________  |
 /        || |______________/| |
|         || |              || |
|         || |   !?!?!?!?   || |
|         || |   ?!?!?!?!   || |
|         || |   !?!?!?!?   || |
|         || |   ?!?!?!?!   || |
|         || |______________|| |
|         || |______________\| |
|         ||                   |
|         ||        ======#### |
|...      ||  &                |
| .....  |\|___________________|
'.  .....||                  |
  "-._ ..||              ##  |
      "-.11__________________|</pre>

	<p class="error-name">{error.name}</p>
	<p class="error-message">{error.message}</p>
</div>

<style>
	pre,
	.error-name,
	.error-message {
		font-family: Courier, monospace;
	}

	.ascii-art {
		width: max-content;
		margin: 1.5rem auto;
		font-size: 12px;
		line-height: 14px;
	}

	.error-name {
		margin: 2rem 0 0;
		text-align: center;
		text-decoration: underline;
	}

	.error-message {
		margin: 0 auto;
		max-width: 30rem;
		font-size: 0.875rem;
	}
</style>
