// Copy this file as config.js and add your Supabase project values.
// These values are safe to use in a browser when your database RLS policies are correct.
// NEVER put a Supabase service_role key here.

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
