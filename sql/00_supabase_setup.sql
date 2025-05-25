-- 00_supabase_setup.sql
-- This file contains instructions for setting up Supabase for the nepCscore app

/*
IMPORTANT SETUP NOTES FOR SUPABASE:

1. Authentication:
   - Supabase manages the auth.users table, so we don't modify it directly
   - We'll use Supabase Auth hooks to create profiles after signup

2. Row Level Security (RLS):
   - All tables should have RLS enabled and appropriate policies
   - Use auth.uid() to get the current user's ID in policies

3. Database Functions:
   - Use SECURITY DEFINER for functions that need to bypass RLS
   - Use SECURITY INVOKER for functions that should respect RLS

4. Running these scripts:
   - Run these scripts in order (01, 02, 03, etc.)
   - You can run them in the Supabase SQL Editor
   - Or use the Supabase CLI for local development

5. Migrations:
   - For production, consider using proper migrations
   - Supabase CLI supports migrations with 'supabase migration'
*/
