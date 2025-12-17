import type { Component, ComponentProps } from 'svelte';
import Item from '../Item.svelte';
import Search from '../Search.svelte';
import StoryList from '../StoryList.svelte';
import User from '../User.svelte';

interface Route<T extends Component> {
	component: T;
	props?: ComponentProps<T>;
}

export const routes: Record<string, Route<Component<any>>> = {
	'/': {
		component: StoryList,
		props: {
			list: 'top',
		},
	},
	'/newest': {
		component: StoryList,
		props: {
			list: 'new',
		},
	},
	'/best': {
		component: StoryList,
		props: {
			list: 'best',
		},
	},
	'/ask': {
		component: StoryList,
		props: {
			list: 'ask',
		},
	},
	'/show': {
		component: StoryList,
		props: {
			list: 'show',
		},
	},
	'/jobs': {
		component: StoryList,
		props: {
			list: 'job',
		},
	},
	'/search': {
		component: Search,
	},
	'/item': {
		component: Item,
	},
	'/user': {
		component: User,
	},
};
