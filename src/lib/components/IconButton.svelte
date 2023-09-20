<script lang="ts">
    import {createEventDispatcher, SvelteComponentTyped, onDestroy, onMount} from "svelte";
    import type {ButtonType} from "../../enum/buttontype";
    export let type: ButtonType;
    export let icon: SvelteComponentTyped;
    export let tooltip = "";
    export let opacity = 100;
	  import { useMediaQuery } from '../stores/stores';


    import tippy from "tippy.js"; 
    import 'tippy.js/dist/tippy.css';

    onMount(() => {
    tippy('.tooltip', {
      content: 'tooltip content',
      placement: 'bottom'
        });

    // Listen for Ctrl+S key combination
    // window.addEventListener('keydown', handleKeyDown);
    });

    // Clean up event listener on component unmount
    // onDestroy(() => {
    //     window.removeEventListener('keydown', handleKeyDown);
    // });


    const dispatcher = createEventDispatcher();
    function onPress(type: ButtonType){
        dispatcher('buttonPressed', { type });
    }

    
    function handleKeyDown(event) {
        //event.PreventDefault();
        // if (event.ctrlKey && event.key === "s") {
        // const saveButton = document.getElementById("saveButton");
        // if (saveButton) {
        //     saveButton.click();
        // }
        // }
    }

</script>
<div class="px-4">
    <button data-tippy-content={tooltip} class="btn btn-ghost custom-button-style tooltip opacity-{opacity}" on:click={() => onPress(type)} aria-label={tooltip}>
        <svelte:component this={icon} size="{useMediaQuery("lg") ? 40 : 20}" class="md:text-small"/>
        
    </button>
</div>

<style lang="scss">
  .custom-button-style {
    &:hover {
      transform: scale(1.15);
      transition-duration: 0.2s;
    }
  }


</style>
