<script lang="ts">
  import { supabase } from "$lib/supabase";
  export let data;

  export let ticket = "";

  const messages = supabase.channel('any')
      .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'tickets' },
        (payload) => {
        data.tickets?.push(payload.new);
        data.tickets = data.tickets;
        
    }).subscribe()


</script>

<button class="btn"><a href="/">GO BACK</a></button>

{#if data.tickets}
    <div >
        {#each data.tickets as ticket}
            <p>{ticket.id}: {ticket.description.slice(0, 100)}{#if ticket.description.length > 100}...{:else}.{/if}</p>
        {/each}
    </div>
{/if}