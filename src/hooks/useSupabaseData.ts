import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Types matching database schema
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string | null;
  price: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: "urgent" | "important" | "regular";
  show_as_popup: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole extends Profile {
  role: "super_admin" | "admin" | "viewer" | null;
}

// Hook for courses
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setCourses(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (course: Omit<Course, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("courses")
      .insert(course)
      .select()
      .single();
    if (!error) {
      await fetchCourses();
    }
    return { data, error };
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    const { data, error } = await supabase
      .from("courses")
      .update(course)
      .eq("id", id)
      .select()
      .single();
    if (!error) {
      await fetchCourses();
    }
    return { data, error };
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) {
      await fetchCourses();
    }
    return { error };
  };

  return { courses, loading, fetchCourses, addCourse, updateCourse, deleteCourse };
};

// Hook for faculty
export const useFaculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setFaculty(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const addFaculty = async (member: Omit<Faculty, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("faculty")
      .insert(member)
      .select()
      .single();
    if (!error) {
      await fetchFaculty();
    }
    return { data, error };
  };

  const updateFaculty = async (id: string, member: Partial<Faculty>) => {
    const { data, error } = await supabase
      .from("faculty")
      .update(member)
      .eq("id", id)
      .select()
      .single();
    if (!error) {
      await fetchFaculty();
    }
    return { data, error };
  };

  const deleteFaculty = async (id: string) => {
    const { error } = await supabase.from("faculty").delete().eq("id", id);
    if (!error) {
      await fetchFaculty();
    }
    return { error };
  };

  return { faculty, loading, fetchFaculty, addFaculty, updateFaculty, deleteFaculty };
};

// Hook for notices
export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setNotices(data as Notice[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const addNotice = async (notice: Omit<Notice, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("notices")
      .insert(notice)
      .select()
      .single();
    if (!error) {
      await fetchNotices();
    }
    return { data, error };
  };

  const updateNotice = async (id: string, notice: Partial<Notice>) => {
    const { data, error } = await supabase
      .from("notices")
      .update(notice)
      .eq("id", id)
      .select()
      .single();
    if (!error) {
      await fetchNotices();
    }
    return { data, error };
  };

  const deleteNotice = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (!error) {
      await fetchNotices();
    }
    return { error };
  };

  return { notices, loading, fetchNotices, addNotice, updateNotice, deleteNotice };
};

// Hook for inquiries
export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const addInquiry = async (inquiry: Omit<Inquiry, "id" | "created_at" | "is_read">) => {
    const { data, error } = await supabase
      .from("inquiries")
      .insert({ ...inquiry, is_read: false })
      .select()
      .single();
    return { data, error };
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) {
      await fetchInquiries();
    }
    return { error };
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ is_read: true })
      .eq("id", id);
    if (!error) {
      await fetchInquiries();
    }
    return { error };
  };

  return { inquiries, loading, fetchInquiries, addInquiry, deleteInquiry, markAsRead };
};

// Hook for user management (super admin only)
export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (authUser?.role !== "super_admin") {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && profiles) {
      // Fetch roles for all users
      const usersWithRoles: UserWithRole[] = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.user_id)
            .maybeSingle();
          
          return {
            ...profile,
            role: (roleData?.role as UserWithRole["role"]) || null,
          };
        })
      );
      setUsers(usersWithRoles);
    }
    setLoading(false);
  }, [authUser?.role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, role: "super_admin" | "admin" | "viewer") => {
    // First, delete existing role
    await supabase.from("user_roles").delete().eq("user_id", userId);
    
    // Then insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    
    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  const removeUserRole = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);
    
    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: isActive })
      .eq("user_id", userId);
    
    if (!error) {
      await fetchUsers();
    }
    return { error };
  };

  return { users, loading, fetchUsers, updateUserRole, removeUserRole, updateUserStatus };
};

// Activity logging
export const logActivity = async (action: string, details?: Record<string, unknown>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("user_activity_log").insert([{
      user_id: user.id,
      action,
      details: details ? JSON.parse(JSON.stringify(details)) : null,
    }]);
  }
};
