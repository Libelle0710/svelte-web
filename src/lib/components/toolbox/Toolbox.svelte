<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import {
        Heading1,
        Heading2,
        Heading3,
        AlignLeft,
        AlignCenter,
        AlignRight,
        Bold,
        Italic,
        Link,
        Type,
        Quote,
        Underline,
        Code,
        Image
    } from "lucide-svelte";


    const dispatch = createEventDispatcher();

    function buttonPressed(type) {
        dispatch('buttonPressed', {
            type: type
        });
    }
</script>

<div class="opacity-95 toolbox border border-primary rounded-full bg-neutral-100">
    <div class="inner-wrapper items-center flex p-4 space-x-2">

        <button class="btn bg-transparent border-transparent">
            <Bold size="24"/>
        </button>


        <button class="btn bg-transparent border-transparent">
            <Italic size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <Underline size="24"/>
        </button>

        <div class="divider divider-horizontal"></div>

        <button class="btn bg-transparent border-transparent">
            <Heading1 size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <Heading2 size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <Heading3 size="24"/>
        </button>

        <div class="divider divider-horizontal"></div>


        <button on:click={() => buttonPressed("paragraph")} class="btn bg-transparent border-transparent">
            <Type size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <Quote size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <Link size="24"/>
        </button>

        <button on:click={() => buttonPressed("code")} class="btn bg-transparent border-transparent">
            <Code size="24"/>
        </button>

        <div class="divider divider-horizontal"></div>
        <button class="btn bg-transparent border-transparent">
            <AlignLeft size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">
            <AlignCenter size="24"/>
        </button>

        <button class="btn bg-transparent border-transparent">

            <AlignRight size="24"/>
        </button>


        <div class="divider divider-horizontal"></div>
        <button class="btn bg-transparent border-transparent">
            <Image size="24"/>
        </button>

        <div class="divider divider-horizontal"></div>
        <button class="btn btn-error">Abbrechen</button>
        <button class="btn btn-success">Sichern</button>
    </div>


</div>

<style lang="scss">

  .toolbox {
  }

  .inner-wrapper {
    //min-width: 600px;
    overflow-x: scroll;
  }

  .inner-wrapper::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

</style>