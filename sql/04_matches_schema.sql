-- 04_matches_schema.sql
-- This file contains the schema for matches and scoring

-- Create enum for match formats
CREATE TYPE public.match_format AS ENUM ('T20', 'ODI', 'Test', 'T10');

-- Create enum for match status
CREATE TYPE public.match_status AS ENUM ('scheduled', 'live', 'completed', 'abandoned', 'cancelled');

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  team1_id UUID NOT NULL REFERENCES public.teams(id),
  team2_id UUID NOT NULL REFERENCES public.teams(id),
  venue TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  format match_format NOT NULL,
  status match_status NOT NULL DEFAULT 'scheduled',
  overs INTEGER NOT NULL,
  toss_winner_id UUID REFERENCES public.teams(id),
  toss_decision TEXT, -- bat, field
  winner_id UUID REFERENCES public.teams(id),
  man_of_the_match_id UUID REFERENCES public.players(id),
  umpire1 TEXT,
  umpire2 TEXT,
  match_referee TEXT,
  notes TEXT,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT different_teams CHECK (team1_id != team2_id)
);

-- Create RLS policies for matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Everyone can view matches
CREATE POLICY "Matches are viewable by everyone" 
  ON public.matches FOR SELECT USING (true);

-- Only admins and organizers can create matches
CREATE POLICY "Admins and organizers can create matches" 
  ON public.matches FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and match organizers can update matches
CREATE POLICY "Admins and match organizers can update matches" 
  ON public.matches FOR UPDATE 
  USING (has_role('admin') OR (has_role('organizer') AND organizer_id = auth.uid()));

-- Only admins and match organizers can delete matches
CREATE POLICY "Admins and match organizers can delete matches" 
  ON public.matches FOR DELETE 
  USING (has_role('admin') OR (has_role('organizer') AND organizer_id = auth.uid()));

-- Create innings table
CREATE TABLE public.innings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  batting_team_id UUID NOT NULL REFERENCES public.teams(id),
  bowling_team_id UUID NOT NULL REFERENCES public.teams(id),
  innings_number INTEGER NOT NULL,
  total_runs INTEGER DEFAULT 0,
  total_wickets INTEGER DEFAULT 0,
  total_overs NUMERIC(6, 1) DEFAULT 0,
  extras INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_innings_number CHECK (innings_number > 0),
  CONSTRAINT valid_wickets CHECK (total_wickets >= 0 AND total_wickets <= 10),
  CONSTRAINT different_innings_teams CHECK (batting_team_id != bowling_team_id),
  UNIQUE (match_id, innings_number)
);

-- Create RLS policies for innings
ALTER TABLE public.innings ENABLE ROW LEVEL SECURITY;

-- Everyone can view innings
CREATE POLICY "Innings are viewable by everyone" 
  ON public.innings FOR SELECT USING (true);

-- Only admins and match organizers can insert innings
CREATE POLICY "Admins and match organizers can create innings" 
  ON public.innings FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.matches m 
      WHERE m.id = match_id AND m.organizer_id = auth.uid()
    ))
  );

-- Only admins and match organizers can update innings
CREATE POLICY "Admins and match organizers can update innings" 
  ON public.innings FOR UPDATE 
  USING (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.matches m 
      WHERE m.id = match_id AND m.organizer_id = auth.uid()
    ))
  );

-- Create batting_performances table
CREATE TABLE public.batting_performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  innings_id UUID NOT NULL REFERENCES public.innings(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id),
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  is_out BOOLEAN DEFAULT false,
  out_method TEXT, -- bowled, caught, lbw, etc.
  bowler_id UUID REFERENCES public.players(id),
  fielder_id UUID REFERENCES public.players(id),
  batting_position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_batting_position CHECK (batting_position > 0 AND batting_position <= 11),
  UNIQUE (innings_id, batting_position)
);

-- Create RLS policies for batting_performances
ALTER TABLE public.batting_performances ENABLE ROW LEVEL SECURITY;

-- Everyone can view batting performances
CREATE POLICY "Batting performances are viewable by everyone" 
  ON public.batting_performances FOR SELECT USING (true);

-- Only admins and match organizers can insert batting performances
CREATE POLICY "Admins and match organizers can create batting performances" 
  ON public.batting_performances FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.innings i 
      JOIN public.matches m ON i.match_id = m.id 
      WHERE i.id = innings_id AND m.organizer_id = auth.uid()
    ))
  );

-- Create bowling_performances table
CREATE TABLE public.bowling_performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  innings_id UUID NOT NULL REFERENCES public.innings(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id),
  overs NUMERIC(6, 1) DEFAULT 0,
  maidens INTEGER DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  wickets INTEGER DEFAULT 0,
  economy NUMERIC(5, 2) GENERATED ALWAYS AS (
    CASE WHEN overs > 0 THEN runs_conceded / overs ELSE 0 END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE (innings_id, player_id)
);

-- Create RLS policies for bowling_performances
ALTER TABLE public.bowling_performances ENABLE ROW LEVEL SECURITY;

-- Everyone can view bowling performances
CREATE POLICY "Bowling performances are viewable by everyone" 
  ON public.bowling_performances FOR SELECT USING (true);

-- Only admins and match organizers can insert bowling performances
CREATE POLICY "Admins and match organizers can create bowling performances" 
  ON public.bowling_performances FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.innings i 
      JOIN public.matches m ON i.match_id = m.id 
      WHERE i.id = innings_id AND m.organizer_id = auth.uid()
    ))
  );

-- Create ball_by_ball table for detailed ball-by-ball commentary
CREATE TABLE public.ball_by_ball (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  innings_id UUID NOT NULL REFERENCES public.innings(id) ON DELETE CASCADE,
  over_number INTEGER NOT NULL,
  ball_number INTEGER NOT NULL,
  batsman_id UUID NOT NULL REFERENCES public.players(id),
  bowler_id UUID NOT NULL REFERENCES public.players(id),
  runs_scored INTEGER DEFAULT 0,
  is_wicket BOOLEAN DEFAULT false,
  wicket_type TEXT,
  fielder_id UUID REFERENCES public.players(id),
  is_extra BOOLEAN DEFAULT false,
  extra_type TEXT, -- wide, no-ball, bye, leg-bye
  extra_runs INTEGER DEFAULT 0,
  total_runs INTEGER DEFAULT 0,
  commentary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_over_number CHECK (over_number > 0),
  CONSTRAINT valid_ball_number CHECK (ball_number > 0 AND ball_number <= 6),
  UNIQUE (innings_id, over_number, ball_number)
);

-- Create RLS policies for ball_by_ball
ALTER TABLE public.ball_by_ball ENABLE ROW LEVEL SECURITY;

-- Everyone can view ball by ball data
CREATE POLICY "Ball by ball data is viewable by everyone" 
  ON public.ball_by_ball FOR SELECT USING (true);

-- Only admins and match organizers can insert ball by ball data
CREATE POLICY "Admins and match organizers can create ball by ball data" 
  ON public.ball_by_ball FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.innings i 
      JOIN public.matches m ON i.match_id = m.id 
      WHERE i.id = innings_id AND m.organizer_id = auth.uid()
    ))
  );

-- Create function to update match statistics after each ball
CREATE OR REPLACE FUNCTION public.update_match_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update batting performance
  UPDATE public.batting_performances
  SET 
    runs_scored = runs_scored + NEW.runs_scored,
    balls_faced = balls_faced + 1,
    fours = CASE WHEN NEW.runs_scored = 4 AND NOT NEW.is_extra THEN fours + 1 ELSE fours END,
    sixes = CASE WHEN NEW.runs_scored = 6 AND NOT NEW.is_extra THEN sixes + 1 ELSE sixes END,
    is_out = CASE WHEN NEW.is_wicket THEN true ELSE is_out END,
    out_method = CASE WHEN NEW.is_wicket THEN NEW.wicket_type ELSE out_method END,
    bowler_id = CASE WHEN NEW.is_wicket THEN NEW.bowler_id ELSE bowler_id END,
    fielder_id = CASE WHEN NEW.is_wicket THEN NEW.fielder_id ELSE fielder_id END,
    updated_at = now()
  WHERE innings_id = NEW.innings_id AND player_id = NEW.batsman_id;
  
  -- Update bowling performance
  UPDATE public.bowling_performances
  SET 
    runs_conceded = runs_conceded + NEW.total_runs,
    wickets = CASE WHEN NEW.is_wicket THEN wickets + 1 ELSE wickets END,
    updated_at = now()
  WHERE innings_id = NEW.innings_id AND player_id = NEW.bowler_id;
  
  -- Update overs in bowling performance if it's the last ball or a wicket
  IF NEW.ball_number = 6 OR NEW.is_wicket THEN
    UPDATE public.bowling_performances
    SET 
      overs = overs + 0.1,
      updated_at = now()
    WHERE innings_id = NEW.innings_id AND player_id = NEW.bowler_id;
  END IF;
  
  -- Update innings
  UPDATE public.innings
  SET 
    total_runs = total_runs + NEW.total_runs,
    total_wickets = CASE WHEN NEW.is_wicket THEN total_wickets + 1 ELSE total_wickets END,
    total_overs = (SELECT COUNT(DISTINCT over_number) - 1 + 
                  (COUNT(DISTINCT ball_number)::NUMERIC / 6) 
                  FROM public.ball_by_ball 
                  WHERE innings_id = NEW.innings_id),
    extras = extras + CASE WHEN NEW.is_extra THEN NEW.extra_runs ELSE 0 END,
    updated_at = now()
  WHERE id = NEW.innings_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_ball_by_ball_insert
  AFTER INSERT ON public.ball_by_ball
  FOR EACH ROW EXECUTE FUNCTION public.update_match_stats();
