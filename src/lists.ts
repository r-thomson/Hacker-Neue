import type { ComponentType, ComponentProps, SvelteComponent } from 'svelte';
import _StoryList from './components/StoryList.svelte';

// work around some typing limitations in svelte 5

type NewComponentType<T extends SvelteComponent = SvelteComponent> = (
	anchor: Node,
	props: ComponentProps<T>,
) => T;

const StoryList: NewComponentType = _StoryList as any;

export const TopStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'top' })) as typeof StoryList as any as ComponentType;

export const NewStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'new' })) as typeof StoryList as any as ComponentType;

export const BestStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'best' })) as typeof StoryList as any as ComponentType;

export const AskStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'ask' })) as typeof StoryList as any as ComponentType;

export const ShowStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'show' })) as typeof StoryList as any as ComponentType;

export const JobStories = ((anchor, props) =>
	StoryList(anchor, { ...props, list: 'job' })) as typeof StoryList as any as ComponentType;
