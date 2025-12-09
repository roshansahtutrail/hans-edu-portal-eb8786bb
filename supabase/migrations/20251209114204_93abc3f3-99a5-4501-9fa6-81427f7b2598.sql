-- Drop existing policies and recreate with proper permissive mode
-- COURSES
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

CREATE POLICY "Anyone can view active courses" 
ON public.courses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all courses" 
ON public.courses 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update courses" 
ON public.courses 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can delete courses" 
ON public.courses 
FOR DELETE 
USING (is_super_admin(auth.uid()));

-- FACULTY
DROP POLICY IF EXISTS "Anyone can view active faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admins can view all faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admins can manage faculty" ON public.faculty;

CREATE POLICY "Anyone can view active faculty" 
ON public.faculty 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all faculty" 
ON public.faculty 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert faculty" 
ON public.faculty 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update faculty" 
ON public.faculty 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can delete faculty" 
ON public.faculty 
FOR DELETE 
USING (is_super_admin(auth.uid()));

-- NOTICES
DROP POLICY IF EXISTS "Anyone can view active notices" ON public.notices;
DROP POLICY IF EXISTS "Admins can view all notices" ON public.notices;
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notices;

CREATE POLICY "Anyone can view active notices" 
ON public.notices 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all notices" 
ON public.notices 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert notices" 
ON public.notices 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update notices" 
ON public.notices 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can delete notices" 
ON public.notices 
FOR DELETE 
USING (is_super_admin(auth.uid()));

-- INQUIRIES
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view inquiries" 
ON public.inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update inquiries" 
ON public.inquiries 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete inquiries" 
ON public.inquiries 
FOR DELETE 
USING (is_admin(auth.uid()));