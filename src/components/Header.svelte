<script>
	import { currentPath } from '../routing/router';
	import SiteLogo from '../components/SiteLogo.svelte';
</script>

<header>
	<div class="header-container">
		<a class="title-container" href="/">
			<SiteLogo />
			<span class="title">Hacker Neue</span>
		</a>
		<nav>
			<ul>
				<li class:active={$currentPath === '/'}>
					<a href="/">top</a>
				</li>
				<li class:active={$currentPath === '/new'}>
					<a href="/new">new</a>
				</li>
				<li class:active={$currentPath === '/best'}>
					<a href="/best">best</a>
				</li>
				<li class:active={$currentPath === '/ask'}>
					<a href="/ask">ask</a>
				</li>
				<li class:active={$currentPath === '/show'}>
					<a href="/show">show</a>
				</li>
				<li class:active={$currentPath === '/jobs'}>
					<a href="/jobs">jobs</a>
				</li>
			</ul>
		</nav>
		<nav>
			<ul>
				<li>
					<a href="https://hn.algolia.com">search</a>
				</li>
				<li class:active={$currentPath === '/info'}>
					<a href="/info">prefs</a>
				</li>
			</ul>
		</nav>
	</div>
</header>

<style>
	a:link {
		text-decoration: none;
	}

	header {
		--header-padding: 0.5rem;

		background-color: var(--color-accent);
		color: #fff;
		white-space: nowrap;
		overflow-x: hidden;
	}

	.header-container {
		display: flex;
		align-items: stretch;

		max-width: calc(
			var(--content-max-width) - 2 * (var(--content-padding-x) - var(--header-padding))
		);
		margin: 0 auto;
		padding: var(--header-padding);
	}

	.header-container > * + * {
		margin-left: var(--header-padding);
	}

	.title-container {
		display: flex;
		align-items: center;
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
		margin: calc(-1 * var(--header-padding)) 0; /* fill height */
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
		border-bottom-color: currentColor;
	}
</style>
