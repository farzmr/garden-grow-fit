-- Bloom: private workout storage

-- 1. Profile: chosen flower + which garden Home shows
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  flower TEXT NOT NULL DEFAULT '🌷',
  main_garden TEXT NOT NULL DEFAULT 'wild-meadow',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage their own profile"
  ON public.profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Completed sessions (workouts and classes)
CREATE TABLE public.sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  activity TEXT NOT NULL,
  minutes INTEGER,
  completed_at TIMESTAMPTZ,
  flower TEXT NOT NULL DEFAULT '🌷',
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  plan_id TEXT,
  plan_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage their own sessions"
  ON public.sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX sessions_owner_date_idx ON public.sessions (user_id, date DESC);

-- 3. Saved routines
CREATE TABLE public.plans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage their own plans"
  ON public.plans FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX plans_owner_position_idx ON public.plans (user_id, position);

-- 4. A workout started but not finished yet
CREATE TABLE public.active_workouts (
  user_id UUID PRIMARY KEY,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  flower TEXT,
  plan_id TEXT,
  plan_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.active_workouts TO authenticated;
GRANT ALL ON public.active_workouts TO service_role;
ALTER TABLE public.active_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners manage their own pending workout"
  ON public.active_workouts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Keep updated_at fresh on the rows that change in place
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER sessions_touch_updated_at BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER plans_touch_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER active_workouts_touch_updated_at BEFORE UPDATE ON public.active_workouts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();