<script>
import { currentPath } from '../routing/router.js';
</script>

<header>
	<img class="logo" src="logo.svg" alt="">
	<h1>HackerNeat</h1>
	<nav>
		<ul>
			<li class:active={ $currentPath === '/' }>
				<a href="/">top</a>
			</li>
			<li class:active={ $currentPath === '/new' }>
				<a href="/new">new</a>
			</li>
			<li class:active={ $currentPath === '/best' }>
				<a href="/best">best</a>
			</li>
			<li class:active={ $currentPath === '/ask' }>
				<a href="/ask">ask</a>
			</li>
			<li class:active={ $currentPath === '/show' }>
				<a href="/show">show</a>
			</li>
			<li class:active={ $currentPath === '/jobs' }>
				<a href="/jobs">jobs</a>
			</li>
			<li>
				<a href="https://hn.algolia.com">search</a>
			</li>
			<li class:active={ $currentPath === '/info' }>
				<a href="/info">info</a>
			</li>
		</ul>
	</nav>
</header>

<style>
.active {
	font-weight: bold;
}
</style>
