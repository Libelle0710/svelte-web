<script lang="ts">
    export let code = '';
    import { clipboard } from "$lib/components/Clipboard/clipboard";
    import { createEventDispatcher,onMount } from "svelte";
    import tippy from "tippy.js"; 
    import 'tippy.js/dist/tippy.css';

    export let buttonLabel = "Copy";
    export let buttonCopied = "\u{1F44D}";
    const dispatch = createEventDispatcher();
    let copyState = false;

    function onCopyClick() {
        copyState = true;
        setTimeout(() => {
        copyState = false;
        }, 2e3);
        dispatch("copy");
    }

    onMount(() => {
        tippy('.tooltip', {
        content: 'tooltip content',
        placement: 'bottom'
            });
    });
</script>
<button data-tippy-content="Hints: Save before Copy." class="codeblock-btn btn btn-sm variant-soft !text-white tooltip" on:click={onCopyClick} use:clipboard={code}>
    {!copyState ? buttonLabel : buttonCopied}
</button>
<style>
    .codeblock-btn{
        border-radius: 30px;
        --tw-bg-opacity: 0.5;
        background-color: hsl(var(--s) / var(--tw-bg-opacity));
    }
</style>