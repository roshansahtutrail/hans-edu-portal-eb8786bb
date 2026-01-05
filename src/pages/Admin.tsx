import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  Users, 
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Bell,
  Settings,
  Lock,
  Shield,
  UserCog,
  Check,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { 
  useCourses, 
  useFaculty, 
  useNotices, 
  useInquiries, 
  useUserManagement,
  Course,
  Faculty,
  Notice,
  Inquiry,
  logActivity 
} from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "courses" | "faculty" | "inquiries" | "notices" | "users" | "settings";

const Admin = () => {
  const navigate = useNavigate();
  const { user, authUser, loading: authLoading, signOut, updatePassword } = useAuth();
  const { courses, loading: coursesLoading, addCourse, updateCourse, deleteCourse } = useCourses();
  const { faculty, loading: facultyLoading, addFaculty, updateFaculty, deleteFaculty } = useFaculty();
  const { notices, loading: noticesLoading, addNotice, updateNotice, deleteNotice } = useNotices();
  const { inquiries, loading: inquiriesLoading, deleteInquiry, markAsRead } = useInquiries();
  const { users, loading: usersLoading, updateUserRole, updateUserStatus, deleteUser } = useUserManagement();
  
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    image: "",
    price: "",
    is_active: true,
  });
  const [facultyForm, setFacultyForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    image: "",
    specialization: "",
    is_active: true,
  });
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    type: "notice" as string,
    priority: "regular" as "urgent" | "important" | "regular",
    show_as_popup: false,
    is_active: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "viewer" as UserRole,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged Out", description: "You have been logged out." });
    navigate("/auth");
  };

  // Permission checks
  const userRole = authUser?.role;
  const canEdit = userRole === "super_admin" || userRole === "admin";
  const canDelete = userRole === "super_admin";
  const canManageUsers = userRole === "super_admin";

  // Course handlers
  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description,
        duration: course.duration,
        level: course.level,
        image: course.image || "",
        price: course.price || "",
        is_active: course.is_active,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: "", description: "", duration: "", level: "Beginner", image: "", price: "", is_active: true });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseForm);
        await logActivity("course_updated", { courseId: editingCourse.id, title: courseForm.title });
        toast({ title: "Course Updated" });
      } else {
        await addCourse(courseForm);
        await logActivity("course_added", { title: courseForm.title });
        toast({ title: "Course Added" });
      }
      setShowCourseModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id);
      await logActivity("course_deleted", { courseId: id });
      toast({ title: "Course Deleted" });
    }
  };

  // Faculty handlers
  const openFacultyModal = (member?: Faculty) => {
    if (member) {
      setEditingFaculty(member);
      setFacultyForm({
        name: member.name,
        designation: member.designation,
        qualification: member.qualification,
        image: member.image || "",
        specialization: member.specialization,
        is_active: member.is_active,
      });
    } else {
      setEditingFaculty(null);
      setFacultyForm({ name: "", designation: "", qualification: "", image: "", specialization: "", is_active: true });
    }
    setShowFacultyModal(true);
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, facultyForm);
        await logActivity("faculty_updated", { facultyId: editingFaculty.id, name: facultyForm.name });
        toast({ title: "Faculty Updated" });
      } else {
        await addFaculty(facultyForm);
        await logActivity("faculty_added", { name: facultyForm.name });
        toast({ title: "Faculty Added" });
      }
      setShowFacultyModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      await deleteFaculty(id);
      await logActivity("faculty_deleted", { facultyId: id });
      toast({ title: "Faculty Deleted" });
    }
  };

  // Inquiry handlers
  const handleViewInquiry = async (inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    setShowInquiryModal(true);
    if (!inquiry.is_read) {
      await markAsRead(inquiry.id);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      await deleteInquiry(id);
      await logActivity("inquiry_deleted", { inquiryId: id });
      toast({ title: "Inquiry Deleted" });
    }
  };

  // Notice handlers
  const openNoticeModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setNoticeForm({
        title: notice.title,
        content: notice.content,
        type: notice.type,
        priority: notice.priority,
        show_as_popup: notice.show_as_popup,
        is_active: notice.is_active,
      });
    } else {
      setEditingNotice(null);
      setNoticeForm({ title: "", content: "", type: "notice", priority: "regular", show_as_popup: false, is_active: true });
    }
    setShowNoticeModal(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, noticeForm);
        await logActivity("notice_updated", { noticeId: editingNotice.id, title: noticeForm.title });
        toast({ title: "Notice Updated" });
      } else {
        await addNotice(noticeForm);
        await logActivity("notice_added", { title: noticeForm.title });
        toast({ title: "Notice Added" });
      }
      setShowNoticeModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      await deleteNotice(id);
      await logActivity("notice_deleted", { noticeId: id });
      toast({ title: "Notice Deleted" });
    }
  };

  // Password handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(passwordForm.newPassword);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // User management handlers
  const handleRoleChange = async (userId: string, role: UserRole) => {
    const { error } = await updateUserRole(userId, role);
    if (error) {
      toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
    } else {
      await logActivity("role_changed", { userId, newRole: role });
      toast({ title: "Role Updated" });
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    const { error } = await updateUserStatus(userId, isActive);
    if (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } else {
      await logActivity("status_changed", { userId, isActive });
      toast({ title: isActive ? "User Activated" : "User Deactivated" });
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await deleteUser(userId);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        await logActivity("user_deleted", { userId, email });
        toast({ title: "User Deleted", description: `User ${email} has been deleted.` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.password || !newUserForm.fullName) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    if (newUserForm.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            email: newUserForm.email,
            password: newUserForm.password,
            fullName: newUserForm.fullName,
            role: newUserForm.role,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }
      await logActivity("user_created", { email: newUserForm.email, role: newUserForm.role });
      toast({ title: "User Created", description: `User ${newUserForm.email} has been created.` });
      setShowAddUserModal(false);
      setNewUserForm({ email: "", password: "", fullName: "", role: "viewer" });
      // Refresh users list
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create user";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "super_admin": return "bg-destructive/10 text-destructive";
      case "admin": return "bg-primary/10 text-primary";
      case "viewer": return "bg-muted text-muted-foreground";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "admin": return "Admin";
      case "viewer": return "Viewer";
      default: return "No Role";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive/10 text-destructive";
      case "important": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
      </div>
    );
  }

  if (!user || !authUser) {
    return null;
  }

  // Check if user has any admin role
  if (!userRole || userRole === "viewer") {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Access Restricted</h1>
          <p className="text-muted-foreground mb-6">
            {userRole === "viewer" 
              ? "You have view-only access. Contact an administrator for edit permissions."
              : "You don't have admin access yet. Please contact a Super Admin to assign you a role."}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Go to Website
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-foreground">Admin Panel</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{authUser.fullName}</p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getRoleBadgeColor(authUser.role))}>
                    {getRoleLabel(authUser.role)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                View Website
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                <Lock className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Change Password</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-card p-2 rounded-xl border border-border overflow-x-auto">
          {[
            { id: "courses" as Tab, label: "Courses", icon: BookOpen, count: courses.length },
            { id: "faculty" as Tab, label: "Faculty", icon: Users, count: faculty.length },
            { id: "notices" as Tab, label: "News & Notices", icon: Bell, count: notices.length },
            { id: "inquiries" as Tab, label: "Inquiries", icon: MessageSquare, count: inquiries.length },
            ...(canManageUsers ? [{ id: "users" as Tab, label: "Users", icon: UserCog, count: users.length }] : []),
            { id: "settings" as Tab, label: "Settings", icon: Settings, count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-1 text-xs px-2 py-0.5 rounded-full",
                  activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Courses</h2>
              {canEdit && (
                <Button onClick={() => openCourseModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              )}
            </div>
            {coursesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className={cn("bg-card rounded-xl border overflow-hidden", course.is_active ? "border-border" : "border-destructive/30 opacity-60")}>
                    <img src={course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"} alt={course.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-bold text-foreground">{course.title}</h3>
                        {!course.is_active && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inactive</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-primary font-semibold">{course.price}</span>
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => openCourseModal(course)}>
                            <Pencil className="w-3 h-3 mr-1" />Edit
                          </Button>
                          {canDelete && (
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Faculty Tab */}
        {activeTab === "faculty" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Faculty</h2>
              {canEdit && (
                <Button onClick={() => openFacultyModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              )}
            </div>
            {facultyLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {faculty.map((member) => (
                  <div key={member.id} className={cn("bg-card rounded-xl border overflow-hidden", member.is_active ? "border-border" : "border-destructive/30 opacity-60")}>
                    <img src={member.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"} alt={member.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-heading font-bold text-foreground">{member.name}</h3>
                        {!member.is_active && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inactive</span>}
                      </div>
                      <p className="text-sm text-primary font-medium mb-1">{member.designation}</p>
                      <p className="text-xs text-muted-foreground mb-3">{member.specialization}</p>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => openFacultyModal(member)}>
                            <Pencil className="w-3 h-3 mr-1" />Edit
                          </Button>
                          {canDelete && (
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteFaculty(member.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage News & Notices</h2>
              {canEdit && (
                <Button onClick={() => openNoticeModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notice
                </Button>
              )}
            </div>
            {noticesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : notices.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notices yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice) => (
                  <div key={notice.id} className={cn("bg-card rounded-xl border p-4", notice.is_active ? "border-border" : "border-destructive/30 opacity-60")}>
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", notice.type === "news" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent")}>
                          {notice.type === "news" ? "News" : "Notice"}
                        </span>
                        <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getPriorityBadge(notice.priority))}>
                          {notice.priority}
                        </span>
                      </div>
                      {notice.show_as_popup && <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">Popup</span>}
                    </div>
                    <h3 className="font-heading font-bold text-foreground mb-2 line-clamp-2">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{notice.content}</p>
                    <p className="text-xs text-muted-foreground mb-3">{new Date(notice.created_at).toLocaleDateString()}</p>
                    {canEdit && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openNoticeModal(notice)}>
                          <Pencil className="w-3 h-3 mr-1" />Edit
                        </Button>
                        {canDelete && (
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteNotice(notice.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Contact Inquiries</h2>
            {inquiriesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : inquiries.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inquiries yet.</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-heading font-semibold text-foreground">Name</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground hidden md:table-cell">Subject</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground hidden lg:table-cell">Date</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground">Status</th>
                      <th className="text-right p-4 font-heading font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className={cn("border-t border-border hover:bg-muted/30", !inquiry.is_read && "bg-primary/5")}>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{inquiry.subject}</td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={cn("text-xs px-2 py-1 rounded-full", inquiry.is_read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary font-medium")}>
                            {inquiry.is_read ? "Read" : "New"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleViewInquiry(inquiry)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            {canDelete && (
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteInquiry(inquiry.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && canManageUsers && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">User Management</h2>
              <Button onClick={() => setShowAddUserModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-heading font-semibold text-foreground">User</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground hidden md:table-cell">Role</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground">Status</th>
                      <th className="text-right p-4 font-heading font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{u.full_name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <select
                            value={u.role || ""}
                            onChange={(e) => handleRoleChange(u.user_id, e.target.value as UserRole)}
                            className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
                            disabled={u.user_id === user?.id}
                          >
                            <option value="">No Role</option>
                            <option value="viewer">Viewer</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={cn("text-xs px-2 py-1 rounded-full", u.is_active ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive")}>
                            {u.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {u.user_id !== user?.id && (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant={u.is_active ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleStatusChange(u.user_id, !u.is_active)}
                              >
                                {u.is_active ? <XCircle className="w-3 h-3 mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                                {u.is_active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(u.user_id, u.email)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Admin Roles</h3>
                    <p className="text-sm text-muted-foreground">Role permissions overview</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Super Admin</p>
                    <p className="text-xs text-muted-foreground">Full access: Manage users, CRUD all content</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Admin</p>
                    <p className="text-xs text-muted-foreground">Can Create and Edit content</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Viewer</p>
                    <p className="text-xs text-muted-foreground">Read-only access</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Security</h3>
                    <p className="text-sm text-muted-foreground">Account security options</p>
                  </div>
                </div>
                <Button onClick={() => setShowPasswordModal(true)} className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">{editingCourse ? "Edit Course" : "Add Course"}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <Input placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
              <Textarea placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Duration (e.g., 6 Months)" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} required />
                <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })} className="bg-background border border-input rounded-md px-3 h-10 text-sm">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <Input placeholder="Image URL" value={courseForm.image} onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })} />
              <Input placeholder="Price (e.g., ₹45,000)" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={courseForm.is_active} onChange={(e) => setCourseForm({ ...courseForm, is_active: e.target.checked })} className="accent-primary" /><span className="text-sm text-foreground">Active</span></label>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCourseModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCourse ? "Update" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Modal */}
      {showFacultyModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">{editingFaculty ? "Edit Faculty" : "Add Faculty"}</h3>
              <button onClick={() => setShowFacultyModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveFaculty} className="space-y-4">
              <Input placeholder="Name" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required />
              <Input placeholder="Designation" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} required />
              <Input placeholder="Qualification" value={facultyForm.qualification} onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })} required />
              <Input placeholder="Specialization" value={facultyForm.specialization} onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })} required />
              <Input placeholder="Image URL" value={facultyForm.image} onChange={(e) => setFacultyForm({ ...facultyForm, image: e.target.value })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={facultyForm.is_active} onChange={(e) => setFacultyForm({ ...facultyForm, is_active: e.target.checked })} className="accent-primary" /><span className="text-sm text-foreground">Active</span></label>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowFacultyModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingFaculty ? "Update" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">{editingNotice ? "Edit Notice" : "Add Notice"}</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveNotice} className="space-y-4">
              <Input placeholder="Title" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
              <Textarea placeholder="Content" value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} rows={4} required />
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="type" value="notice" checked={noticeForm.type === "notice"} onChange={() => setNoticeForm({ ...noticeForm, type: "notice" })} className="accent-primary" /><span className="text-sm text-foreground">Notice</span></label>
                <label className="flex items-center gap-2"><input type="radio" name="type" value="news" checked={noticeForm.type === "news"} onChange={() => setNoticeForm({ ...noticeForm, type: "news" })} className="accent-primary" /><span className="text-sm text-foreground">News</span></label>
              </div>
              <div>
                <label className="text-sm text-foreground mb-2 block">Priority</label>
                <select value={noticeForm.priority} onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as "urgent" | "important" | "regular" })} className="w-full bg-background border border-input rounded-md px-3 h-10 text-sm">
                  <option value="regular">Regular</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={noticeForm.show_as_popup} onChange={(e) => setNoticeForm({ ...noticeForm, show_as_popup: e.target.checked })} className="accent-primary" /><span className="text-sm text-foreground">Show as popup on landing page</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={noticeForm.is_active} onChange={(e) => setNoticeForm({ ...noticeForm, is_active: e.target.checked })} className="accent-primary" /><span className="text-sm text-foreground">Active</span></label>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNoticeModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingNotice ? "Update" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && viewingInquiry && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">Inquiry Details</h3>
              <button onClick={() => setShowInquiryModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium text-foreground">{viewingInquiry.name}</p></div>
              <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-foreground">{viewingInquiry.email}</p></div>
              {viewingInquiry.phone && <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium text-foreground">{viewingInquiry.phone}</p></div>}
              <div><p className="text-sm text-muted-foreground">Subject</p><p className="font-medium text-foreground">{viewingInquiry.subject}</p></div>
              <div><p className="text-sm text-muted-foreground">Message</p><p className="text-foreground">{viewingInquiry.message}</p></div>
              <div><p className="text-sm text-muted-foreground">Date</p><p className="text-foreground">{new Date(viewingInquiry.created_at).toLocaleString()}</p></div>
            </div>
            <Button className="w-full mt-6" onClick={() => setShowInquiryModal(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
              <Input type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={newUserForm.fullName} 
                onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })} 
                required 
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={newUserForm.email} 
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} 
                required 
              />
              <Input 
                type="password" 
                placeholder="Password (min 6 characters)" 
                value={newUserForm.password} 
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} 
                required 
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select 
                  value={newUserForm.role} 
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                  className="w-full bg-background border border-input rounded-md px-3 h-10 text-sm"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
