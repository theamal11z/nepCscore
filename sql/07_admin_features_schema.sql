-- 07_admin_features_schema.sql
-- This file contains the schema for admin-specific features

-- Create system_settings table for application-wide settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view system settings
CREATE POLICY "System settings are viewable by everyone" 
  ON public.system_settings FOR SELECT USING (true);

-- Only admins can update system settings
CREATE POLICY "Only admins can update system settings" 
  ON public.system_settings FOR INSERT 
  WITH CHECK (has_role('admin'));

CREATE POLICY "Only admins can modify system settings" 
  ON public.system_settings FOR UPDATE 
  USING (has_role('admin'));

-- Create audit_logs table for tracking important system changes
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- user, tournament, match, etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (has_role('admin'));

-- Function to automatically create audit logs on important changes
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE 
      WHEN TG_OP = 'INSERT' THEN NULL
      ELSE to_jsonb(OLD)
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN NULL
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_verification_requests table for handling user role upgrade requests
CREATE TABLE public.user_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_role user_role NOT NULL,
  existing_role user_role NOT NULL, -- Changed from current_role which is a reserved keyword
  reason TEXT NOT NULL,
  supporting_documents JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for user_verification_requests
ALTER TABLE public.user_verification_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification requests, admins can view all
CREATE POLICY "Users can view their own verification requests" 
  ON public.user_verification_requests FOR SELECT 
  USING (auth.uid() = user_id OR has_role('admin'));

-- Users can create their own verification requests
CREATE POLICY "Users can create their own verification requests" 
  ON public.user_verification_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update verification requests
CREATE POLICY "Only admins can update verification requests" 
  ON public.user_verification_requests FOR UPDATE 
  USING (has_role('admin'));

-- Create function to update user role when verification request is approved
CREATE OR REPLACE FUNCTION public.handle_verification_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE public.profiles
    SET 
      role = NEW.requested_role,
      updated_at = now()
    WHERE id = NEW.user_id;
    
    -- Create notification for the user
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      notification_type,
      reference_id,
      reference_type
    )
    VALUES (
      NEW.user_id,
      'Role Upgrade Approved',
      'Your request to become a ' || NEW.requested_role || ' has been approved',
      'role_upgrade',
      NEW.id,
      'verification_request'
    );
  ELSIF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    -- Create notification for the user
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      notification_type,
      reference_id,
      reference_type
    )
    VALUES (
      NEW.user_id,
      'Role Upgrade Rejected',
      'Your request to become a ' || NEW.requested_role || ' has been rejected',
      'role_upgrade',
      NEW.id,
      'verification_request'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_verification_request_update
  AFTER UPDATE OF status ON public.user_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_verification_approval();

-- Create admin_dashboard_stats view for quick access to system statistics
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'player') AS total_players,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'organizer') AS total_organizers,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'fan') AS total_fans,
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.teams) AS total_teams,
  (SELECT COUNT(*) FROM public.tournaments) AS total_tournaments,
  (SELECT COUNT(*) FROM public.matches) AS total_matches,
  (SELECT COUNT(*) FROM public.matches WHERE status = 'live') AS live_matches,
  (SELECT COUNT(*) FROM public.user_verification_requests WHERE status = 'pending') AS pending_verifications;

-- Note: We can't use SECURITY INVOKER directly on views in some PostgreSQL versions
-- Instead, we'll use a secure view pattern with RLS on the underlying tables

-- For securing the view, we'll create a wrapper function that checks admin role
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  total_players INTEGER,
  total_organizers INTEGER,
  total_fans INTEGER,
  total_users INTEGER,
  total_teams INTEGER,
  total_tournaments INTEGER,
  total_matches INTEGER,
  live_matches INTEGER,
  pending_verifications INTEGER
) AS $$
BEGIN
  IF NOT has_role('admin') THEN
    RAISE EXCEPTION 'Access denied: Only administrators can view dashboard statistics';
  END IF;
  
  RETURN QUERY SELECT * FROM public.admin_dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create maintenance_mode function for admins to enable/disable system maintenance
CREATE OR REPLACE FUNCTION public.set_maintenance_mode(enable BOOLEAN)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT has_role('admin') THEN
    RAISE EXCEPTION 'Only administrators can change maintenance mode';
  END IF;
  
  -- Update or insert the maintenance mode setting
  INSERT INTO public.system_settings (
    setting_key,
    setting_value,
    description,
    updated_by
  )
  VALUES (
    'maintenance_mode',
    jsonb_build_object('enabled', enable, 'message', 'System is under maintenance. Please try again later.'),
    'Controls whether the system is in maintenance mode',
    auth.uid()
  )
  ON CONFLICT (setting_key)
  DO UPDATE SET
    setting_value = jsonb_build_object('enabled', enable, 'message', 'System is under maintenance. Please try again later.'),
    updated_by = auth.uid(),
    updated_at = now();
    
  RETURN enable;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
