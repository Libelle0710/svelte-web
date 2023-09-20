<script lang="ts">
    import {Heading1, Heading2, Heading3, Text, GripVertical} from "lucide-svelte";
    import {onMount} from "svelte";
    import {supabase} from "$lib/supabase"
    import ChatBubble from "$lib/components/chat/ChatBubble.svelte";
    import Toolbox from "$lib/components/toolbox/Toolbox.svelte";
    import {Highlight} from "svelte-highlight";
    import {csharp, typescript} from "svelte-highlight/languages";
    import "svelte-highlight/styles/github-dark.css";
    export let data;

    let drag = -1;
    let dragElement;

    let div1: HTMLDivElement;
    let div2: HTMLDivElement;

    let defaultTitle = "Gib einen Titel ein..";

    let blocks = [
        {
            id: 1,
            order: 0,
            text: "Text 1",
            type: "paragraph"
        },
        {
            id: 2,
            order: 2,
            text: "Text 3",
            type: "paragraph"
        },
        {
            id: 3,
            order: 1,
            text: "Text 2",
            type: "paragraph"
        },
        {
            id: 3,
            order: 1,
            text: "print('Hello World')",
            type: "code"
        },

    ];


    onMount(() => {
        if (document.addEventListener) {
            document.addEventListener('contextmenu', function (e) {
                e.preventDefault();

            }, false);
        } else {
            document.attachEvent('oncontextmenu', function () {
                // window.event.returnValue = false;
            });
        }
    })

    async function updateSupabase() {
        const editedContent = div1.textContent;
        const {data, error} = await supabase
            .from('editedPosts')
            .update({text: editedContent})
            .eq('id', 1)
            .select();

        if (error) {
            console.error('Error updating content:', error);
        } else {
            console.log(data)
            console.log('Content updated successfully:', editedContent);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        let draggedIndex = e
            .dataTransfer
            .getData("tag");

        var elems = document.querySelectorAll(".drag-divider");

        [].forEach.call(elems, function (el) {
            el.classList.remove("divider");
        });

        const directionDown = draggedIndex < droppedIndex;
        if(!directionDown)
            droppedIndex += 1;

        for (let i in blocks) {
            let block = blocks[i];

            if(block.id == dragElement.id){
                block.order = droppedIndex;
            }
            else if (directionDown && block.order <= droppedIndex && block.order >= draggedIndex) {
                block.order = block.order - 1;
            } else if (!directionDown && block.order >= droppedIndex && block.order <= draggedIndex) {
                block.order = block.order + 1;
            }
        }

        blocks = blocks;
    }

    let droppedIndex;

    function handleToolboxButtonPress(e) {
        const type = e.detail.type;
        const id = Math.max(...blocks.map(o => o.id)) + 1;
        const order = Math.max(...blocks.map(o => o.order)) + 1;
        let block = {
            id: id,
            order: order,
            text: "Text " + id,
            type: type
        };
        blocks.push(block);
        blocks = blocks;
    }

</script>
<div class="fixed">
    <Toolbox
        on:buttonPressed={handleToolboxButtonPress}
    />
</div>
<div class="container pt-20 md:m-10 border border-primary mx-auto">
<div class="w-40">
</div>
    <div id="main-title" class="text-6xl m-5" contenteditable="true" on:focusout={() => {
        const titleTag = document.getElementById("main-title");
        if(titleTag.innerText.trim().length === 0) {
            titleTag.innerText = defaultTitle;
        }

    }} on:focus={() => {
        const titleTag = document.getElementById("main-title");
        if(titleTag.innerText.trim() === defaultTitle) {
            titleTag.innerText = "";
        }
    }}>
        {defaultTitle}
    </div>


    <div class="m-4 space-y-3 ">
        {#each blocks.sort((a, b) => a.order > b.order ? 1 : -1) as block}
            <div on:dragstart={(e) => {
                        e.dataTransfer.setData("tag", block.order)
                        dragElement = block;
                    }
                }
                 on:drop={(e) => {
                droppedIndex = block.order;
                handleDrop(e);
            }} ondragover="return false" on:dragover={() => {

                var elems = document.querySelectorAll(".drag-divider");

                [].forEach.call(elems, function(el) {
                    el.classList.remove("divider");
                });

                document.getElementById(`block-${block.order}`).classList.add("divider");
            }}>
                <div class="flex p-3" draggable="{block.id == drag}">
                    <div class="opacity-25 m-2" on:mouseup={() => {drag = -1}} on:mousedown={() => {
                            drag = block.id;
                            console.log(drag);
                        }
                            }>
                        <GripVertical />
                    </div>
                    <div contenteditable="true"><p class="text-3xl {block.type}">{block.text}</p></div>
                </div>
                <div class="drag-divider" id="block-{block.order}"/>
            </div>
        {/each}
    </div>

    <!--    <div class="text-6xl text-center m-5" contenteditable="true" placeholder="Type here" on:blur={updateSupabase} bind:this={div1} >Start typing and editing here.</div>-->

</div>


<style lang="scss">

  [contenteditable] {
    outline: 0px solid transparent;
  }

  button {
    margin: 15px;
  }

  .heading1 {
    color: red;
  }

  .test {
    text-decoration: underline;
  }

  .placeholder {
    opacity: 0.4;
  }

  .container {
    height: 2000px;
  }

  .code {
    @apply border;
    @apply rounded-md;
    @apply p-4;
    font-family: monospace;
    font-size: 20px;
    color: white;
    background-color: #9ca3af;
  }
</style>