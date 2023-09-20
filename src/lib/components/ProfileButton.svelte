<script lang="ts">
    import { ChevronDown } from 'lucide-svelte';
    import { applyAction, enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import {supabase} from "$lib/supabase";

    export let username = '';
    export let imgSrc;
    export let base64 = false;

    export let isPresent = true;


</script>

<div class="dropdown dropdown-bottom dropdown-end shrink-0">
    <div tabindex="0" class="btn btn-outline btn-ghost rounded-full my-auto">
        <span class="text-md username">{username}</span>
        <div class="avatar" class:online={isPresent} class:offline={!isPresent}>
            <div class="image-container rounded-full">
                {#if base64}
                    <img src="data:image/jpeg;base64,{imgSrc}" />
                {:else}
                    <img src={imgSrc} />
                {/if}
            </div>
        </div>
    </div>
    <form
            id="form"
            on:submit={async () => {
                const {error} = await supabase.auth.signOut();
                console.log(error);
                console.log("logout triggered");
                console.log(await supabase.auth.getSession());
            }}
    >
        <ul
                tabindex="0"
                class="dropdown-content menu menu-compact p-2 shadow bg-accent-focus/5 rounded-box w-80"
        >
            <li><a>Profil</a></li>
            <li><a>Einstellungen</a></li>
            <li>
                <button type="submit">Logout</button>
            </li>
        </ul>
    </form>
</div>
<div />

<style lang="scss">
  .image-container {
    img {
      width: functions.toRem(50);
    }
  }

  .btn {
    padding: 1px;
    height: functions.toRem(54);
    @include breakpoint.down('sm') {
      background-color: transparent;
    }

    &:focus,
    &:hover {
      transform: scale(1.05);
      transition-duration: 0.2s;
    }
  }

  .dropdown-content {
    @apply bg-base-100;
    @apply rounded-box;
  }

  .username {
    margin: 0px 10px;
    text-transform: none;
    vertical-align: center;
    @include breakpoint.down('lg') {
      display: none;
    }
  }
</style>