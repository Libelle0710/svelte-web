<script lang="ts">
    import { invalidate } from '$app/navigation'
    import { onMount } from 'svelte'
    import '../styles/main.scss';
    import ThemeSelector from "$lib/components/ThemeSelector.svelte";
    import ProfileButton from "$lib/components/ProfileButton.svelte";


    export let data

    let { supabase, session } = data
    $: ({ supabase, session } = data)

    onMount(() => {
        const {data: { subscription }} = supabase.auth.onAuthStateChange((event, _session) => {
                console.log("auth state changed");
            // if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            // }
        })

        return () => subscription.unsubscribe()
    });

</script>
<div class="navbar">
<div class="navbar-start">

</div>
        <div class="navbar-center">

        </div>
        <div class="navbar-end ">
                <ThemeSelector/>
                <div class="m-1" />
                {#if session}
                        <ProfileButton username="Us3r" base64="false" imgSrc="" />
                {/if}
        </div>
</div>
<!--<div class="drawer lg:drawer-open">-->
<!--    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />-->
<!--    <div class="drawer-content flex flex-col items-center justify-center">-->
        <!-- Page content here -->
<!--        <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>-->
        <slot/>
<!--    </div>-->
<!--    <div class="drawer-side">-->
<!--        <label for="my-drawer-2" class="drawer-overlay"></label>-->
<!--        <ul class="menu p-4 w-80 h-full bg-base-200 text-base-content">-->
<!--            &lt;!&ndash; Sidebar content here &ndash;&gt;-->
<!--            <li><a>Sidebar Item 1</a></li>-->
<!--            <li><a>Sidebar Item 2</a></li>-->
<!--        </ul>-->

<!--    </div>-->
<!--</div>-->



