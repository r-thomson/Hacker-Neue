<script>
	import { currentPath } from '../routing/router';
</script>

<header>
	<img class="logo" src="logo.svg" alt="" width="20" height="20">
	<h1 class="title">
		<a href="/">HackerNeat</a>
	</h1>
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
			<li class:active={$currentPath === '/jobs'} style="margin-right: 1.0em;">
				<a href="/jobs">jobs</a>
			</li>
			<li style="margin-left: auto;">
				<a href="https://hn.algolia.com">search</a>
			</li>
			<li class:active={$currentPath === '/info'}>
				<a href="/info">info</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		background-color: hsl(22, 97%, 53%);
		color: #fff;
		align-items: center;
		padding: 0.5em;
		line-height: 1;
		display: flex;
		flex-wrap: wrap;
	}

	header a {
		text-decoration: none;
	}

	.logo {
		margin-right: 0.5em;
	}

	.title {
		margin: 0;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 1.4285714286rem;
		letter-spacing: 0.02em;
		margin-right: 0.5em;
	}

	nav {
		flex-grow: 1;
	}

	nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
	}

	nav li {
		margin: 0 0.3em;
		opacity: 0.75;
	}

	nav li:first-child { margin-left: 0; }
	nav li:last-child { margin-right: 0; }

	nav li.active, nav li:hover {
		opacity: 1.0;
	}
</style>
