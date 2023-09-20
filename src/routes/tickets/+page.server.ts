import { supabase } from "$lib/supabase"

export async function load() {
    
    const {data} = await supabase.from("tickets").select();

    return {
        tickets: data
    }
  }