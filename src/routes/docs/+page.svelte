<script lang="ts">
    import {getPosts, posts} from "$lib/stores/stores";
    import {onDestroy, onMount} from "svelte";
    import {supabase} from "$lib/supabase";

    let isLoading = false;
    let postSubscription = null;
    onMount(() => {
        postSubscription = getPosts();
    })

    let newID: number;
    async function addSupabaseAndPostsRow(){
        isLoading = true;
        const newPost = {
                            title: 'TITLE',
                            short_description: 'Short description',
                            blocks: [
                                {
                                    type: 'Text',
                                    classes: '',
                                    codeText: '',
                                    contents: '',
                                    language: 'HTML',
                                    orderIndex: 0,
                                },
                            ],
                        };
        const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select();

        if (error) {
            console.error('Error adding a new row:', error);
            return;
        }
        
        newID = data[0].id;
        posts.update((val) => [...val, { id: newID, ...newPost }]);
        window.location.href = `docs/${newID}`;
    }
    
</script>

<div class="m-20">
    <button class="flex btn m-10" on:click={addSupabaseAndPostsRow}>Neuen Beitrag erstellen</button>
    {#each $posts as post}
        <button class="btn btn-ghost"><a href="docs/{post.id}"><h1 class="text-4xl">{post.title}</h1></a></button>
        <p class="m-4 w-3/4">{post.short_description}</p>
    {/each}
</div>

{#if isLoading}
    <div class="overlay">
        <div class="loading-message">
            Please wait...
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100; 
    }

    .loading-message {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    }
</style>