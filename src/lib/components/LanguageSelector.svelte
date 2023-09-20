<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let languages:String[] = ['HTML','JavaScript', 'C#','C'];

    export let selected_language:string; 

    function selectLanguage() {
        dispatch('languageSelected', {
            value: selected_language
        });
    }
</script>

<select class="custom-select" bind:value={selected_language} on:change={selectLanguage}>
    {#each languages as language}
    <option value={language}>
        {language}
    </option>
    {/each}
</select>

<style>
    .custom-select {
        --tw-bg-opacity: 0.5;
        background-color: hsl(var(--s) / var(--tw-bg-opacity));
    }
    .custom-select option {
        --tw-bg-opacity: 1;
        background-color: hsl(var(--s) / var(--tw-bg-opacity));
    }
</style>