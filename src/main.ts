import App from './App.svelte';
import './global.css';
import './goatcounter.svelte';
import { mount } from 'svelte';

const app = mount(App, {
	target: document.getElementById('app')!,
});

export default app;
