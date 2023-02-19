import type { ComponentConstructorOptions } from 'svelte';
import StoryList from './components/StoryList.svelte';

export class TopStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'top' } });
	}
}

export class NewStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'new' } });
	}
}

export class BestStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'best' } });
	}
}

export class AskStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'ask' } });
	}
}

export class ShowStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'show' } });
	}
}

export class JobStories extends StoryList {
	constructor(options: ComponentConstructorOptions) {
		super({ ...options, props: { list: 'job' } });
	}
}
