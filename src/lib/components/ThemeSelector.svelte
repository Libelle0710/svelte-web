<script>
	import {theme} from '../stores/stores';
	import {Palette} from 'lucide-svelte';
	import ThemePreview from '$lib/components/ThemePreview.svelte';
	import {onMount} from "svelte";

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];
	let selectedTheme = $theme;
	$: {
		theme.set(selectedTheme);
	}

	const storedTheme = theme;
	let themeSelected = false;
</script>

<div class="dropdown dropdown-bottom dropdown-end shadow-xl z-50">
	<label tabindex="0" class="btn btn-ghost btn-circle">
		<Palette/>
	</label>
	<ul
			on:mouseleave={() => {
				if(!themeSelected) {
					selectedTheme = storedTheme;
					console.log("mouseleave");
				} else {
					themeSelected = false;
				}
			}}
			tabindex="0"
			class="dropdown-content shadow-xl flex-nowrap menu align-middle w-96 rounded-box bg-base-100 p-2 "
	>
		{#each themes as theme}
			<div
					class="m-1"
					on:mouseover={() => {
						selectedTheme = theme;
					}}
					on:click={() => {
					selectedTheme = theme;
					themeSelected = true;
					if (document.activeElement != document.body) document.activeElement.blur();
				}}
			>
				<ThemePreview {theme}/>
			</div>
		{/each}
	</ul>
</div>

<style lang="scss">
	.dropdown {
		@apply rounded-box;
	}

	.dropdown-content {
		width: 210px;
		max-height: 66vh;
		overflow-y: auto;
		transition: opacity 0.25s;
	}
</style>