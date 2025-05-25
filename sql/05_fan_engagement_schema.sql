-- 05_fan_engagement_schema.sql
-- This file contains the schema for fan engagement features like reactions, comments, and following

-- Create user_follows table for fans to follow players, teams, and tournaments
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  follow_type TEXT NOT NULL, -- player, team, tournament
  follow_id UUID NOT NULL, -- ID of the player, team, or tournament
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE (user_id, follow_type, follow_id)
);

-- Create RLS policies for user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Users can view their own follows and admins can view all follows
CREATE POLICY "Users can view their own follows" 
  ON public.user_follows FOR SELECT 
  USING (auth.uid() = user_id OR has_role('admin'));

-- Users can create their own follows
CREATE POLICY "Users can create their own follows" 
  ON public.user_follows FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own follows
CREATE POLICY "Users can delete their own follows" 
  ON public.user_follows FOR DELETE 
  USING (auth.uid() = user_id);

-- Create match_reactions table for fans to react to matches
CREATE TABLE public.match_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- like, love, wow, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE (match_id, user_id, reaction_type)
);

-- Create RLS policies for match_reactions
ALTER TABLE public.match_reactions ENABLE ROW LEVEL SECURITY;

-- Everyone can view match reactions
CREATE POLICY "Match reactions are viewable by everyone" 
  ON public.match_reactions FOR SELECT USING (true);

-- Users can create their own reactions
CREATE POLICY "Users can create their own reactions" 
  ON public.match_reactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions" 
  ON public.match_reactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Create match_comments table for fans to comment on matches
CREATE TABLE public.match_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  parent_id UUID REFERENCES public.match_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for match_comments
ALTER TABLE public.match_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can view match comments
CREATE POLICY "Match comments are viewable by everyone" 
  ON public.match_comments FOR SELECT USING (true);

-- Users can create their own comments
CREATE POLICY "Users can create their own comments" 
  ON public.match_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.match_comments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own comments, and admins can delete any comment
CREATE POLICY "Users can delete their own comments" 
  ON public.match_comments FOR DELETE 
  USING (auth.uid() = user_id OR has_role('admin'));

-- Create match_polls table for organizers to create polls during matches
CREATE TABLE public.match_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for match_polls
ALTER TABLE public.match_polls ENABLE ROW LEVEL SECURITY;

-- Everyone can view match polls
CREATE POLICY "Match polls are viewable by everyone" 
  ON public.match_polls FOR SELECT USING (true);

-- Only admins and organizers can create polls
CREATE POLICY "Admins and organizers can create polls" 
  ON public.match_polls FOR INSERT 
  WITH CHECK (has_role('admin') OR has_role('organizer'));

-- Only admins and poll creators can update polls
CREATE POLICY "Admins and poll creators can update polls" 
  ON public.match_polls FOR UPDATE 
  USING (has_role('admin') OR auth.uid() = creator_id);

-- Create poll_options table for poll choices
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.match_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for poll_options
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

-- Everyone can view poll options
CREATE POLICY "Poll options are viewable by everyone" 
  ON public.poll_options FOR SELECT USING (true);

-- Only admins and poll creators can create poll options
CREATE POLICY "Admins and poll creators can create poll options" 
  ON public.poll_options FOR INSERT 
  WITH CHECK (
    has_role('admin') OR 
    (EXISTS (
      SELECT 1 FROM public.match_polls p 
      WHERE p.id = poll_id AND p.creator_id = auth.uid()
    ))
  );

-- Create poll_votes table for user votes
CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.match_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE (poll_id, user_id)
);

-- Create RLS policies for poll_votes
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Everyone can view poll vote counts
CREATE POLICY "Poll votes are viewable by everyone" 
  ON public.poll_votes FOR SELECT USING (true);

-- Users can create their own votes
CREATE POLICY "Users can create their own votes" 
  ON public.poll_votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- match_start, match_end, tournament_update, etc.
  reference_id UUID, -- ID of the related entity (match, tournament, etc.)
  reference_type TEXT, -- Type of the related entity (match, tournament, etc.)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to create notifications for followers when a match starts
CREATE OR REPLACE FUNCTION public.notify_match_followers()
RETURNS TRIGGER AS $$
BEGIN
  -- When a match status changes to 'live'
  IF NEW.status = 'live' AND OLD.status != 'live' THEN
    -- Notify team followers
    INSERT INTO public.notifications (user_id, title, message, notification_type, reference_id, reference_type)
    SELECT 
      uf.user_id,
      'Match Started',
      'A match with your followed team has started',
      'match_start',
      NEW.id,
      'match'
    FROM public.user_follows uf
    WHERE (uf.follow_type = 'team' AND (uf.follow_id = NEW.team1_id OR uf.follow_id = NEW.team2_id))
    OR (uf.follow_type = 'tournament' AND uf.follow_id = NEW.tournament_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_match_status_change
  AFTER UPDATE OF status ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.notify_match_followers();
