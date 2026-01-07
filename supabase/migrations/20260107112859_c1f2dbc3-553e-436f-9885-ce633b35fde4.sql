-- Add display_order column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Add display_order column to faculty table
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Add display_order column to founder_message table
ALTER TABLE public.founder_message ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON public.courses(display_order);
CREATE INDEX IF NOT EXISTS idx_faculty_display_order ON public.faculty(display_order);
CREATE INDEX IF NOT EXISTS idx_founder_message_display_order ON public.founder_message(display_order);