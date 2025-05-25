-- 03_teams_players_schema.sql
-- This file contains the schema for teams and players

-- Create enum for player roles
CREATE TYPE public.player_role AS ENUM ('batsman', 'bowler', 'all_rounder', 'wicket_keeper');

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  established_date DATE,
  home_ground TEXT,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  captain_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Everyone can view teams
CREATE POLICY "Teams are viewable by everyone" 
  ON public.teams FOR SELECT USING (true);

-- Only admins and organizers can create teams
CREATE POLICY "Admins and organizers can create teams" 
  ON public.teams FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and team owners can update teams
CREATE POLICY "Admins and team owners can update teams" 
  ON public.teams FOR UPDATE 
  USING (has_role('admin') OR (has_role('organizer') AND owner_id = auth.uid()));

-- Only admins and team owners can delete teams
CREATE POLICY "Admins and team owners can delete teams" 
  ON public.teams FOR DELETE 
  USING (has_role('admin') OR (has_role('organizer') AND owner_id = auth.uid()));

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  team_id UUID REFERENCES public.teams(id),
  jersey_number INTEGER,
  role player_role NOT NULL,
  batting_style TEXT,
  bowling_style TEXT,
  date_of_birth DATE,
  height NUMERIC(5, 2), -- in cm
  weight NUMERIC(5, 2), -- in kg
  is_captain BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Everyone can view players
CREATE POLICY "Players are viewable by everyone" 
  ON public.players FOR SELECT USING (true);

-- Only admins, organizers, and the player themselves can insert player records
CREATE POLICY "Admins, organizers, and players can create player records" 
  ON public.players FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    has_role('organizer') OR 
    (has_role('player') AND profile_id = auth.uid())
  );

-- Only admins, team owners, and the player themselves can update player records
CREATE POLICY "Admins, team owners, and players can update player records" 
  ON public.players FOR UPDATE 
  USING (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.teams t 
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )) OR
    (has_role('player') AND profile_id = auth.uid())
  );

-- Create tournament_teams junction table
CREATE TABLE public.tournament_teams (
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'registered', -- registered, approved, rejected
  PRIMARY KEY (tournament_id, team_id)
);

-- Create RLS policies for tournament_teams
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;

-- Everyone can view tournament teams
CREATE POLICY "Tournament teams are viewable by everyone" 
  ON public.tournament_teams FOR SELECT USING (true);

-- Only admins, tournament organizers, and team owners can register teams for tournaments
CREATE POLICY "Admins, tournament organizers, and team owners can register teams" 
  ON public.tournament_teams FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )) OR
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.teams t 
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    ))
  );

-- Create player_stats table
CREATE TABLE public.player_stats (
  player_id UUID PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  matches_played INTEGER DEFAULT 0,
  runs_scored INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  best_bowling TEXT,
  centuries INTEGER DEFAULT 0,
  half_centuries INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  catches INTEGER DEFAULT 0,
  stumpings INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for player_stats
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can view player stats
CREATE POLICY "Player stats are viewable by everyone" 
  ON public.player_stats FOR SELECT USING (true);

-- Only admins, organizers, and the player themselves can update player stats
CREATE POLICY "Admins, organizers, and players can update player stats" 
  ON public.player_stats FOR UPDATE 
  USING (
    has_role('admin') OR 
    has_role('organizer') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.id = player_id AND p.profile_id = auth.uid()
    ))
  );
