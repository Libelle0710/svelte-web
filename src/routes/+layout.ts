// src/routes/+layout.ts
// import { ANON_KEY, PROJ_URL } from '$env/static/private'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import {redirect} from "@sveltejs/kit";

// @ts-ignore
export const load = async ({ fetch, data, depends, url }) => {
    depends('supabase:auth')

    const supabase = createSupabaseLoadClient({
        supabaseUrl: "https://zxwtosxhpptbqrirkwph.supabase.co",
        supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3Rvc3hocHB0YnFyaXJrd3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE0MDUzNjYsImV4cCI6MjAwNjk4MTM2Nn0.wQph68EJZTDmMl8JCEc81HfpWePKX4sm4-9ZXQBZ6ak",
        event: { fetch },
        serverSession: data.session,
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()


    //Falls er permanent zu redirects zum Login kommt:
    //https://stackoverflow.com/questions/73205096/run-sveltekit-dev-with-https
    //https://stackoverflow.com/questions/69417788/vite-https-on-localhost

    if (!session && url.pathname !== '/auth/login') {
        console.log('redirecting to /login');
        throw redirect(307, '/auth/login');
    }

    if (session && url.pathname === '/auth/login') {
        console.log('redirecting to /');
        throw redirect(307, '/');
    }

    return { supabase, session }
}