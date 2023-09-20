export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [0];

export const dictionary = {
		"/": [2],
		"/auth/login": [~3],
		"/backup/dox": [~4],
		"/chat": [~5],
		"/docs": [6],
		"/docs/[id]": [~7],
		"/redmine/snapshot": [~8],
		"/redmine/sync": [~9],
		"/sandbox": [10],
		"/tickets": [~11]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';