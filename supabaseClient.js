import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "url";
const SUPABASE_ANON_KEY = "ANON";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
