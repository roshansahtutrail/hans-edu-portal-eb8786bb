-- Enable realtime updates for inquiries so admin panel can update instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;