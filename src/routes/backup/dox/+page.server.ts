import { supabase } from "$lib/supabase"

export async function load() {
    
    const {data} = await supabase.from("editedPosts").select(); 

    return {
        data: data
    }
  }