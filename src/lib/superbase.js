import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Store code -> display name, used across the app
export const STORES = {
  C1: "Taman Mutiara Mas",
  C2: "Mount Austin",
  C3: "Puchong",
};
