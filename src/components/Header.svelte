<script lang="ts">
	import HackerNeueIcon from '../icons/HackerNeueIcon.svelte';
	import SearchIcon from '../icons/SearchIcon.svelte';
	import SlidersIcon from '../icons/SlidersIcon.svelte';
	import { currentUrl } from '../routing/router';
	import PreferencesModal from './PreferencesModal.svelte';

	let prefsModalOpen = false;
</script>

<header>
	<div class="header-contents">
		<a class="title-container" href="/">
			<HackerNeueIcon />
			<span class="title">Hacker Neue</span>
		</a>
		<nav>
			<ul>
				<li class:active={$currentUrl.pathname === '/'}>
					<a href="/">top</a>
				</li>
				<li class:active={$currentUrl.pathname === '/newest'}>
					<a href="/newest">new</a>
				</li>
				<li class:active={$currentUrl.pathname === '/best'}>
					<a href="/best">best</a>
				</li>
				<li class:active={$currentUrl.pathname === '/ask'}>
					<a href="/ask">ask</a>
				</li>
				<li class:active={$currentUrl.pathname === '/show'}>
					<a href="/show">show</a>
				</li>
				<li class:active={$currentUrl.pathname === '/jobs'}>
					<a href="/jobs">jobs</a>
				</li>
			</ul>
		</nav>
		<nav>
			<ul>
				<li class:active={$currentUrl.pathname === '/search'}>
					<a href="/search">
						<SearchIcon aria-label="search" role="img" />
					</a>
				</li>
				<li>
					<button type="button" on:click={() => (prefsModalOpen = true)}>
						<SlidersIcon aria-label="preferences" role="img" />
					</button>
				</li>
			</ul>
		</nav>
	</div>
</header>

<PreferencesModal bind:open={prefsModalOpen} />

<style>
	a:link {
		text-decoration: none;
	}

	button {
		all: unset;
		outline: revert;
		cursor: pointer;
	}

	header {
		--header-inset: 8px;

		padding-top: var(--header-inset);
		padding-right: max(var(--header-inset), env(safe-area-inset-right));
		padding-bottom: var(--header-inset);
		padding-left: max(var(--header-inset), env(safe-area-inset-left));

		background-color: var(--color-accent);
		color: #fff;
		white-space: nowrap;
		overflow-x: hidden;

		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}

	.header-contents {
		display: flex;
		align-items: stretch;

		box-sizing: content-box;
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.header-contents > * + * {
		margin-left: 0.5rem;
	}

	.title-container {
		display: flex;
		align-items: center;
	}

	.title-container > :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.title-container > .title {
		margin-left: 0.5rem;
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1;
	}

	@media (max-width: 32em) {
		.title-container > .title {
			display: none;
		}
	}

	nav {
		margin: calc(-1 * var(--header-inset)) 0; /* fill height */
	}

	nav:first-of-type {
		margin-right: auto;
	}

	nav ul {
		height: 100%;
		display: flex;
		align-items: stretch;
		margin: 0;
		padding: 0;
	}

	li + li {
		margin-left: 0.125rem;
	}

	li {
		list-style-type: none;
		display: flex;
		align-items: center;
		padding: 0 0.25rem;

		border-color: transparent;
		border-style: solid none;
		border-width: 2px 0;
	}

	li.active {
		border-bottom-color: #fafaf9;
	}

	li :global(svg) {
		margin: 0.25rem 0.125rem;
		width: 1rem;
		height: 1rem;
	}
</style>
