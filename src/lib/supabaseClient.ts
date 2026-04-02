import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lluvcuhlhkeojtxgxndh.supabase.co"; 
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdXZjdWhsaGtlb2p0eGd4bmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjI5NzgsImV4cCI6MjA5MDYzODk3OH0.Wov2EXjtunjf6TM2UUYI6cxrZuYmaGiobdvOZNjH6aE"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
