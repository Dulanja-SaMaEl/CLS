import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://soxycakyzkatpfkpcifm.supabase.co";

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveHljYWt5emthdHBma3BjaWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTI3MzYsImV4cCI6MjEwNzU2ODczNn0.la8TWGQljSixAAFjdti-3GLriIjZ0qjomCRe1HJwX2c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
