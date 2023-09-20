<script>

    import {supabase} from "$lib/supabase.js";

    let tickets = [];

    const channel = supabase.channel('any')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tickets' },
            (payload) => {
                tickets.push(payload.new);
                tickets = tickets;
            }
        )
        .subscribe()

</script>

<main>
    <h1>Sync</h1>
    <form action="?/syncissues" method="POST" class="auth-form">
        <input name="maxOffset"/>
        <button type="submit" class="btn btn-primary">Sync</button>
    </form>

    <ul>
        {#each tickets as issue}
            <li>{issue.id}: {issue.subject}</li>
        {/each}
    </ul>
</main>