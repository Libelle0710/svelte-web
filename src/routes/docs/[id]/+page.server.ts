import { supabase } from "$lib/supabase"

export async function load({ params }) {

    const {data} = await supabase.from("posts").select();
    return {
        name: "posts",
        id: params.id,
    }
  }