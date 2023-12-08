import { createClient } from "@supabase/supabase-js";

const supabaseProject = import.meta.env.VITE_SUPABASE_PROJECT;
const supabaseUrl = `https://${supabaseProject}.supabase.co`;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
