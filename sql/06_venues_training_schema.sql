-- 06_venues_training_schema.sql
-- This file contains the schema for venues and player training sessions

-- Create venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER,
  description TEXT,
  image_url TEXT,
  has_floodlights BOOLEAN DEFAULT false,
  has_dressing_rooms BOOLEAN DEFAULT true,
  has_practice_facilities BOOLEAN DEFAULT false,
  pitch_type TEXT, -- grass, artificial, clay, etc.
  dimensions TEXT, -- e.g., "70m x 65m"
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for venues
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Everyone can view venues
CREATE POLICY "Venues are viewable by everyone" 
  ON public.venues FOR SELECT USING (true);

-- Only admins and organizers can create venues
CREATE POLICY "Admins and organizers can create venues" 
  ON public.venues FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and venue creators can update venues
CREATE POLICY "Admins and venue creators can update venues" 
  ON public.venues FOR UPDATE 
  USING (has_role('admin') OR (has_role('organizer') AND created_by = auth.uid()));

-- Only admins and venue creators can delete venues
CREATE POLICY "Admins and venue creators can delete venues" 
  ON public.venues FOR DELETE 
  USING (has_role('admin') OR (has_role('organizer') AND created_by = auth.uid()));

-- Create venue_availability table
CREATE TABLE public.venue_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  booked_by UUID REFERENCES public.profiles(id),
  booking_purpose TEXT, -- match, practice, event, etc.
  booking_reference_id UUID, -- ID of match, training session, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  UNIQUE (venue_id, date, start_time, end_time)
);

-- Create RLS policies for venue_availability
ALTER TABLE public.venue_availability ENABLE ROW LEVEL SECURITY;

-- Everyone can view venue availability
CREATE POLICY "Venue availability is viewable by everyone" 
  ON public.venue_availability FOR SELECT USING (true);

-- Only admins and organizers can create venue availability
CREATE POLICY "Admins and organizers can create venue availability" 
  ON public.venue_availability FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and the person who booked can update venue availability
CREATE POLICY "Admins and bookers can update venue availability" 
  ON public.venue_availability FOR UPDATE 
  USING (has_role('admin') OR (booked_by = auth.uid()));

-- Create training_sessions table for player training
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  venue_id UUID NOT NULL REFERENCES public.venues(id),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT NOT NULL, -- batting, bowling, fielding, fitness, etc.
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_session_time CHECK (end_time > start_time)
);

-- Create RLS policies for training_sessions
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- Team members and coaches can view their team's training sessions
CREATE POLICY "Team members can view their training sessions" 
  ON public.training_sessions FOR SELECT 
  USING (
    has_role('admin') OR 
    has_role('organizer') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.team_id = training_sessions.team_id AND p.profile_id = auth.uid()
    ))
  );

-- Only admins, organizers, and team coaches can create training sessions
-- Note: We need to use a different approach for checking captain status in INSERT policies
CREATE POLICY "Admins and organizers can create training sessions" 
  ON public.training_sessions FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    has_role('organizer')
  );

-- For players who are captains, we'll use a function to check before insert
CREATE OR REPLACE FUNCTION public.check_player_is_captain(team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.players p 
    WHERE p.team_id = team_id AND p.profile_id = auth.uid() AND p.is_captain = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Team captains can create training sessions" 
  ON public.training_sessions FOR INSERT 
  WITH CHECK (
    has_role('player') AND check_player_is_captain(team_id)
  );

-- Create training_attendance table
CREATE TABLE public.training_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, declined, attended
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE (training_id, player_id)
);

-- Create RLS policies for training_attendance
ALTER TABLE public.training_attendance ENABLE ROW LEVEL SECURITY;

-- Team members and coaches can view their team's training attendance
CREATE POLICY "Team members can view their training attendance" 
  ON public.training_attendance FOR SELECT 
  USING (
    has_role('admin') OR 
    has_role('organizer') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.training_sessions ts
      JOIN public.players p ON ts.team_id = p.team_id
      WHERE ts.id = training_attendance.training_id AND p.profile_id = auth.uid()
    ))
  );

-- Players can update their own attendance
CREATE POLICY "Players can update their own attendance" 
  ON public.training_attendance FOR UPDATE 
  USING (
    has_role('admin') OR 
    has_role('organizer') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.id = player_id AND p.profile_id = auth.uid()
    ))
  );

-- Create player_training_logs table for tracking individual training progress
CREATE TABLE public.player_training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  training_id UUID REFERENCES public.training_sessions(id) ON DELETE SET NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  training_type TEXT NOT NULL, -- batting, bowling, fielding, fitness, etc.
  duration INTEGER NOT NULL, -- in minutes
  notes TEXT,
  performance_rating INTEGER, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT valid_rating CHECK (performance_rating IS NULL OR (performance_rating >= 1 AND performance_rating <= 10))
);

-- Create RLS policies for player_training_logs
ALTER TABLE public.player_training_logs ENABLE ROW LEVEL SECURITY;

-- Players can view their own training logs, coaches can view their team's logs
CREATE POLICY "Players can view their own training logs" 
  ON public.player_training_logs FOR SELECT 
  USING (
    has_role('admin') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.id = player_id AND p.profile_id = auth.uid()
    )) OR
    (has_role('organizer') AND EXISTS (
      SELECT 1 FROM public.players p 
      JOIN public.teams t ON p.team_id = t.id
      WHERE p.id = player_id AND t.owner_id = auth.uid()
    ))
  );

-- Players can create their own training logs
CREATE POLICY "Players can create their own training logs" 
  ON public.player_training_logs FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.id = player_id AND p.profile_id = auth.uid()
    ))
  );

-- Players can update their own training logs
CREATE POLICY "Players can update their own training logs" 
  ON public.player_training_logs FOR UPDATE 
  USING (
    has_role('admin') OR 
    (has_role('player') AND EXISTS (
      SELECT 1 FROM public.players p 
      WHERE p.id = player_id AND p.profile_id = auth.uid()
    ))
  );

-- Create function to automatically book venue when creating a training session
CREATE OR REPLACE FUNCTION public.book_venue_for_training()
RETURNS TRIGGER AS $$
DECLARE
  _venue_id UUID;
  _session_date DATE;
  _start_time TIME;
  _end_time TIME;
  _created_by UUID;
  _id UUID;
BEGIN
  -- Assign values from the NEW record to local variables
  _venue_id := NEW.venue_id;
  _session_date := NEW.session_date;
  _start_time := NEW.start_time;
  _end_time := NEW.end_time;
  _created_by := NEW.created_by;
  _id := NEW.id;
  
  -- Check if venue is available
  IF EXISTS (
    SELECT 1 FROM public.venue_availability va
    WHERE va.venue_id = _venue_id
      AND va.date = _session_date
      AND va.start_time <= _start_time
      AND va.end_time >= _end_time
      AND va.is_booked = false
  ) THEN
    -- Book the venue
    UPDATE public.venue_availability
    SET 
      is_booked = true,
      booked_by = _created_by,
      booking_purpose = 'training',
      booking_reference_id = _id,
      updated_at = now()
    WHERE venue_id = _venue_id
      AND date = _session_date
      AND start_time <= _start_time
      AND end_time >= _end_time
      AND is_booked = false;
      
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Venue is not available for the requested time';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_training_session_created
  AFTER INSERT ON public.training_sessions
  FOR EACH ROW EXECUTE FUNCTION public.book_venue_for_training();
