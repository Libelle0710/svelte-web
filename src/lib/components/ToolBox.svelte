<script lang="ts">
    import {
        Heading1,
        Heading2,
        Heading3,
        AlignLeft,
        AlignCenter,
        AlignRight,
        Bold,
        Italic,
        Paintbrush2,
        Link,
        Type,
        Quote,
        Underline,
        Code,
        Upload,
        Save,
        Trash
    } from "lucide-svelte";
    import {createEventDispatcher, beforeUpdate, afterUpdate} from "svelte";
    import {ButtonType} from "../../enum/buttontype";
    import IconButton from "./IconButton.svelte";

    const buttons = [
        {icon: Heading1, type: ButtonType.H1, tooltip: "Überschrift groß"},
        {icon: Heading2, type: ButtonType.H2, tooltip: "Überschrift mittel"},
        {icon: Heading3, type: ButtonType.H3, tooltip: "Überschrift klein"},
        {type: ButtonType.Separator},
        {icon: Bold, type: ButtonType.Bold, tooltip: "Fett"},
        {icon: Italic, type: ButtonType.Italic, tooltip: "Kursiv"},
        {icon: Underline, type: ButtonType.Underline, tooltip: "Unterstrichen"},
        {type: ButtonType.Separator},
        {icon: AlignLeft, type: ButtonType.AlignLeft, tooltip: "Linksbündig"},
        {icon: AlignCenter, type: ButtonType.AlignCenter, tooltip: "Mittig"},
        {icon: AlignRight, type: ButtonType.AlignRight, tooltip: "Rechtsbündig"},
        {type: ButtonType.Separator},
        {icon: Paintbrush2, type: ButtonType.Paintbrush, tooltip: "Farbe"},
        {type: ButtonType.Separator},
        {icon: Type, type: ButtonType.Text, tooltip: "Text"},
        {icon: Link, type: ButtonType.Link, tooltip: "Hyperlink"},
        {icon: Quote, type: ButtonType.Quote, tooltip: "Zitat"},
        {icon: Code, type: ButtonType.Code, tooltip: "Code-Block"},
        {type: ButtonType.Separator},
        {icon: Upload, type: ButtonType.Upload, tooltip: "Hochladen"},
        {type: ButtonType.Separator},
        {icon: Trash, type: ButtonType.Trash, tooltip: "Entfernen"},
        {icon: Save, type: ButtonType.Save, tooltip: "Speichern"},

    ]

    const colours = ['BLACK', 'WHITE', 'GREY', 'RED', 'BLUE','YELLOW', 'VIOLET', 'ORANGE', 'GREEN', 'PRIMARY', 'SECONDARY']
    let isDropdownActive = false;
    let paintbrushButtonPositionLeft: number | undefined;

    const dispatch = createEventDispatcher();

    function toolBoxButtonPressed(type: string) {
        dispatch('buttonPressed', { type });
    }

    function toggleDropdown() {
        isDropdownActive = !isDropdownActive;
        const paintBrushButton = document.getElementById('paintbrush');
        paintbrushButtonPositionLeft = paintBrushButton?.getBoundingClientRect().left;
    }


</script>
<div class="toolbox-wrapper" >

    <div class="toolbox flex rounded-full shadow-lg mx-auto space-x-4 py-5 bg-base-100 " style="{isDropdownActive ? 'overflow-x: hidden' : 'overflow-x: auto;'}">
        {#each buttons as {icon, type, tooltip}}
            {#if type !== ButtonType.Separator}
                <!-- svelte-ignore missing-declaration -->
                {#if type == ButtonType.Paintbrush}
                    <button tabindex="0" class="btn btn-ghost custom-button-style" on:click={toggleDropdown} id="paintbrush">
                        <Paintbrush2/>
                    </button>
                {:else}
                <IconButton opacity={60} {icon} {type} {tooltip} on:buttonPressed={() => {toolBoxButtonPressed(type)}} />
                {/if}
            {:else}
                <div class="divider divider-horizontal"></div>
            {/if}
        {/each}
    </div>
    {#if isDropdownActive}
        <ul class="dropdown-content flex-nowrap menu align-middle w-96 rounded-box bg-base-100 p-2" style="margin-left: {paintbrushButtonPositionLeft}px;" on:mouseleave={toggleDropdown}>
            {#each colours as colour}
                    <button class="btn btn-ghost custom-button-style colour-container mt-1 bg-base-100" 
                    on:click={() => {toolBoxButtonPressed(colour)}}>
                    {colour}</button>
            {/each}
        </ul>
    {/if}
</div>

<style>

    .toolbox-wrapper {
        position: fixed;
        top: 80px;
        left: 50%;
        width: 100%;
        transform: translateX(-50%);
    }

    .toolbox {
        width: 90%;
    }

    .toolbox::-webkit-scrollbar {
        height: 0px;
    }

    .custom-button-style:hover  {
        transform: scale(1.15);
        transition-duration: 0.2s;
    }
    .colour-container {
        width: 100%;
        height: 35px;
        display: flex;
        align-items: center; 
        justify-content: center;
    }
	.dropdown-content {
        @apply rounded-box;
		width: 120px;
		max-height: 300px;
        overflow-y: auto;
	}

</style>
