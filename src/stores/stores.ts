
import type { Writable } from "svelte/store"
import {
    writable
} from "svelte/store";
import {supabase} from "$lib/supabase";
import type {Post} from "../app";

// const { subscribe, set, update }: Writable<Post> = writable({});
// export const postStore = {
//     subscribe,
//     set,
//     update,
//     save: async (post: Post) => {
//         const { data: { session } } = await supabase.auth.getSession();
//         const { data: savedProject } = await supabase.from('posts').insert(post)
//         update((post) => post);
//     }
// };
