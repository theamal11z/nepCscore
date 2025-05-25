-- 02_tournaments_schema.sql
-- This file contains the schema for tournaments and related features

-- Create enum for tournament formats
CREATE TYPE public.tournament_format AS ENUM ('T20', 'ODI', 'Test', 'T10');

-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'in_progress', 'completed', 'cancelled');

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  format tournament_format NOT NULL,
  status tournament_status NOT NULL DEFAULT 'upcoming',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue TEXT,
  max_teams INTEGER NOT NULL,
  prize_pool NUMERIC(10, 2),
  logo_url TEXT,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create RLS policies for tournaments
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Everyone can view tournaments
CREATE POLICY "Tournaments are viewable by everyone" 
  ON public.tournaments FOR SELECT USING (true);

-- Only admins and organizers can insert tournaments
CREATE POLICY "Admins and organizers can create tournaments" 
  ON public.tournaments FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and the tournament organizer can update tournaments
CREATE POLICY "Admins and tournament organizers can update tournaments" 
  ON public.tournaments FOR UPDATE 
  USING (has_role('admin') OR (has_role('organizer') AND organizer_id = auth.uid()));

-- Only admins and the tournament organizer can delete tournaments
CREATE POLICY "Admins and tournament organizers can delete tournaments" 
  ON public.tournaments FOR DELETE 
  USING (has_role('admin') OR (has_role('organizer') AND organizer_id = auth.uid()));

-- Create tournament_stats table for caching tournament statistics
CREATE TABLE public.tournament_stats (
  tournament_id UUID PRIMARY KEY REFERENCES public.tournaments(id) ON DELETE CASCADE,
  total_matches INTEGER DEFAULT 0,
  completed_matches INTEGER DEFAULT 0,
  total_teams INTEGER DEFAULT 0,
  total_players INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  highest_score_match_id UUID,
  most_sixes INTEGER DEFAULT 0,
  most_sixes_player_id UUID,
  most_wickets INTEGER DEFAULT 0,
  most_wickets_player_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for tournament_stats
ALTER TABLE public.tournament_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can view tournament stats
CREATE POLICY "Tournament stats are viewable by everyone" 
  ON public.tournament_stats FOR SELECT USING (true);

-- Only admins and the tournament organizer can update tournament stats
CREATE POLICY "Admins and tournament organizers can update tournament stats" 
  ON public.tournament_stats FOR UPDATE 
  USING (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    ))
  );

-- Create function to update tournament stats
CREATE OR REPLACE FUNCTION public.update_tournament_stats(tournament_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Implementation would calculate stats from matches, teams, and players
  -- This is a placeholder for the actual implementation
  UPDATE public.tournament_stats
  SET updated_at = now()
  WHERE tournament_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
