-- Add image column to notices table for news/notice images
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS image TEXT;

-- Create founder_message table for "Our Founder Says" section
CREATE TABLE public.founder_message (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  message TEXT NOT NULL,
  image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on founder_message
ALTER TABLE public.founder_message ENABLE ROW LEVEL SECURITY;

-- RLS policies for founder_message
CREATE POLICY "Anyone can view active founder message" 
ON public.founder_message 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all founder messages" 
ON public.founder_message 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert founder message" 
ON public.founder_message 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update founder message" 
ON public.founder_message 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can delete founder message" 
ON public.founder_message 
FOR DELETE 
USING (is_super_admin(auth.uid()));

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_founder_message_updated_at
BEFORE UPDATE ON public.founder_message
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();