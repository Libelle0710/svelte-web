import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit"
import type { Handle } from "@sveltejs/kit"
import {ANON_KEY, PROJ_URL} from "$env/static/private";
import {redirect} from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {

    event.locals.supabase = createSupabaseServerClient({
        supabaseKey: ANON_KEY,
        supabaseUrl: PROJ_URL,
        event
    })

    event.locals.getSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();

        return session;
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        }
    });
}