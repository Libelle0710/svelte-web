<script lang="ts">
	export let theme;
</script>

<div data-theme={theme} class="bg-base-100 text-base-content w-full cursor-pointer font-sans border rounded-md">
	<div class="grid grid-cols-5 grid-rows-3">
		<div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
				 class="invisible h-3 w-3 shrink-0">
				<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
			</svg>
			<div class="flex-grow text-sm">{theme.toUpperCase()}</div>
			<div class="flex h-full flex-shrink-0 flex-wrap gap-1">
				<div class="bg-primary w-2 rounded"></div>
				<div class="bg-secondary w-2 rounded"></div>
				<div class="bg-accent w-2 rounded"></div>
				<div class="bg-neutral w-2 rounded"></div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.theme-text::first-letter {
		text-transform: capitalize;
	}
</style>