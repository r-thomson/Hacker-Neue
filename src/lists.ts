import type { Component } from 'svelte';
import StoryList from './components/StoryList.svelte';

export const TopStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'top' });

export const NewStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'new' });

export const BestStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'best' });

export const AskStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'ask' });

export const ShowStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'show' });

export const JobStories: Component = (anchor, props) =>
	StoryList(anchor, { ...props, list: 'job' });
