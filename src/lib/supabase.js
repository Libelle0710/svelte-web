import { createClient } from '@supabase/supabase-js'
// import { PROJ_URL, ANON_KEY } from '$env/static/private'

// export const supabase = createClient(PROJ_URL, ANON_KEY)

export const supabase = createClient("https://zxwtosxhpptbqrirkwph.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3Rvc3hocHB0YnFyaXJrd3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE0MDUzNjYsImV4cCI6MjAwNjk4MTM2Nn0.wQph68EJZTDmMl8JCEc81HfpWePKX4sm4-9ZXQBZ6ak");