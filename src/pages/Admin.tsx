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
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getInquiries,
  deleteInquiry,
  getNotices,
  addNotice,
  updateNotice,
  deleteNotice,
  updateAdminPassword,
  getAdminSession,
  initializeData,
  canEdit,
  canDelete,
  canManageSettings,
  Course,
  Faculty,
  Inquiry,
  Notice,
  AdminSession,
} from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "courses" | "faculty" | "inquiries" | "notices" | "settings";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    image: "",
    price: "",
  });
  const [facultyForm, setFacultyForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    image: "",
    specialization: "",
  });
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    type: "notice" as "news" | "notice",
    isImportant: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    initializeData();
    const adminSession = getAdminSession();
    setSession(adminSession);
    loadData();
  }, []);

  const loadData = () => {
    setCourses(getCourses());
    setFaculty(getFaculty());
    setInquiries(getInquiries());
    setNotices(getNotices());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loginSession = adminLogin(username, password);
    if (loginSession) {
      setSession(loginSession);
      toast({ title: "Login Successful", description: `Welcome, ${loginSession.name}!` });
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    adminLogout();
    setSession(null);
    toast({ title: "Logged Out", description: "You have been logged out." });
  };

  // Course handlers
  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description,
        duration: course.duration,
        level: course.level,
        image: course.image,
        price: course.price,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: "", description: "", duration: "", level: "", image: "", price: "" });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, courseForm);
      toast({ title: "Course Updated" });
    } else {
      addCourse(courseForm);
      toast({ title: "Course Added" });
    }
    setShowCourseModal(false);
    loadData();
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(id);
      toast({ title: "Course Deleted" });
      loadData();
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
        image: member.image,
        specialization: member.specialization,
      });
    } else {
      setEditingFaculty(null);
      setFacultyForm({ name: "", designation: "", qualification: "", image: "", specialization: "" });
    }
    setShowFacultyModal(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      updateFaculty(editingFaculty.id, facultyForm);
      toast({ title: "Faculty Updated" });
    } else {
      addFaculty(facultyForm);
      toast({ title: "Faculty Added" });
    }
    setShowFacultyModal(false);
    loadData();
  };

  const handleDeleteFaculty = (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      deleteFaculty(id);
      toast({ title: "Faculty Deleted" });
      loadData();
    }
  };

  // Inquiry handlers
  const handleViewInquiry = (inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    setShowInquiryModal(true);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      deleteInquiry(id);
      toast({ title: "Inquiry Deleted" });
      loadData();
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
        isImportant: notice.isImportant,
      });
    } else {
      setEditingNotice(null);
      setNoticeForm({ title: "", content: "", type: "notice", isImportant: false });
    }
    setShowNoticeModal(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      updateNotice(editingNotice.id, noticeForm);
      toast({ title: "Notice Updated" });
    } else {
      addNotice(noticeForm);
      toast({ title: "Notice Added" });
    }
    setShowNoticeModal(false);
    loadData();
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      deleteNotice(id);
      toast({ title: "Notice Deleted" });
      loadData();
    }
  };

  // Password handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (session) {
      const success = updateAdminPassword(session.username, passwordForm.newPassword);
      if (success) {
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast({ title: "Error", description: "Failed to update password.", variant: "destructive" });
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-destructive/10 text-destructive";
      case "editor": return "bg-primary/10 text-primary";
      case "viewer": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "editor": return "Editor";
      case "viewer": return "Viewer";
      default: return role;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground mt-2">Hans Educational Institute</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate("/")}>
                ← Back to Website
              </Button>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Super Admin:</strong> admin / password123</p>
                <p><strong>Editor:</strong> editor / editor123</p>
                <p><strong>Viewer:</strong> viewer / viewer123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userCanEdit = canEdit(session.role);
  const userCanDelete = canDelete(session.role);
  const userCanManageSettings = canManageSettings(session.role);

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
                  <p className="text-xs text-muted-foreground">{session.name}</p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getRoleBadgeColor(session.role))}>
                    {getRoleLabel(session.role)}
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
            ...(userCanManageSettings ? [{ id: "settings" as Tab, label: "Settings", icon: Settings, count: 0 }] : []),
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
              {userCanEdit && (
                <Button onClick={() => openCourseModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-primary font-semibold">{course.price}</span>
                      <span className="text-muted-foreground">{course.duration}</span>
                    </div>
                    {userCanEdit && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openCourseModal(course)}>
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {userCanDelete && (
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
          </div>
        )}

        {/* Faculty Tab */}
        {activeTab === "faculty" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Faculty</h2>
              {userCanEdit && (
                <Button onClick={() => openFacultyModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map((member) => (
                <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{member.designation}</p>
                    <p className="text-xs text-muted-foreground mb-3">{member.specialization}</p>
                    {userCanEdit && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openFacultyModal(member)}>
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {userCanDelete && (
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
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage News & Notices</h2>
              {userCanEdit && (
                <Button onClick={() => openNoticeModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notice
                </Button>
              )}
            </div>
            {notices.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notices yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice) => (
                  <div key={notice.id} className={cn(
                    "bg-card rounded-xl border p-4",
                    notice.isImportant ? "border-accent" : "border-border"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        notice.type === "news" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      )}>
                        {notice.type === "news" ? "News" : "Notice"}
                      </span>
                      {notice.isImportant && (
                        <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">Important</span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-foreground mb-2 line-clamp-2">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{notice.content}</p>
                    <p className="text-xs text-muted-foreground mb-3">{new Date(notice.date).toLocaleDateString()}</p>
                    {userCanEdit && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openNoticeModal(notice)}>
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {userCanDelete && (
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
            {inquiries.length === 0 ? (
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
                      <th className="text-left p-4 font-heading font-semibold text-foreground">Email</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground hidden md:table-cell">Phone</th>
                      <th className="text-left p-4 font-heading font-semibold text-foreground hidden lg:table-cell">Date</th>
                      <th className="text-right p-4 font-heading font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-4 text-foreground">{inquiry.name}</td>
                        <td className="p-4 text-muted-foreground">{inquiry.email}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{inquiry.phone}</td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell">
                          {new Date(inquiry.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleViewInquiry(inquiry)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            {userCanDelete && (
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

        {/* Settings Tab */}
        {activeTab === "settings" && userCanManageSettings && (
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
                    <p className="text-sm text-muted-foreground">Manage admin access levels</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Super Admin</p>
                    <p className="text-xs text-muted-foreground">Full access: Create, Edit, Delete all content + Settings</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Editor</p>
                    <p className="text-xs text-muted-foreground">Can Create and Edit content, cannot Delete</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Viewer</p>
                    <p className="text-xs text-muted-foreground">Read-only access to view all content</p>
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
              <h3 className="text-xl font-heading font-bold text-foreground">
                {editingCourse ? "Edit Course" : "Add Course"}
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <Input
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Duration (e.g., 6 Months)"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  required
                />
                <Input
                  placeholder="Level (e.g., Beginner)"
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  required
                />
              </div>
              <Input
                placeholder="Image URL"
                value={courseForm.image}
                onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                required
              />
              <Input
                placeholder="Price (e.g., ₹45,000)"
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCourseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCourse ? "Update" : "Add"} Course
                </Button>
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
              <h3 className="text-xl font-heading font-bold text-foreground">
                {editingFaculty ? "Edit Faculty" : "Add Faculty"}
              </h3>
              <button onClick={() => setShowFacultyModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFaculty} className="space-y-4">
              <Input
                placeholder="Name"
                value={facultyForm.name}
                onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                required
              />
              <Input
                placeholder="Designation"
                value={facultyForm.designation}
                onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                required
              />
              <Input
                placeholder="Qualification"
                value={facultyForm.qualification}
                onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                required
              />
              <Input
                placeholder="Specialization"
                value={facultyForm.specialization}
                onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                required
              />
              <Input
                placeholder="Image URL"
                value={facultyForm.image}
                onChange={(e) => setFacultyForm({ ...facultyForm, image: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowFacultyModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingFaculty ? "Update" : "Add"} Faculty
                </Button>
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
              <h3 className="text-xl font-heading font-bold text-foreground">
                {editingNotice ? "Edit Notice" : "Add Notice"}
              </h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNotice} className="space-y-4">
              <Input
                placeholder="Title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Content"
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                rows={4}
                required
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="notice"
                    checked={noticeForm.type === "notice"}
                    onChange={() => setNoticeForm({ ...noticeForm, type: "notice" })}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">Notice</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="news"
                    checked={noticeForm.type === "news"}
                    onChange={() => setNoticeForm({ ...noticeForm, type: "news" })}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">News</span>
                </label>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={noticeForm.isImportant}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                  className="accent-destructive"
                />
                <span className="text-sm text-foreground">Mark as Important</span>
              </label>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNoticeModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingNotice ? "Update" : "Add"} Notice
                </Button>
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
              <button onClick={() => setShowInquiryModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{viewingInquiry.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{viewingInquiry.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-foreground">{viewingInquiry.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-foreground">{new Date(viewingInquiry.date).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="text-foreground bg-muted/50 p-3 rounded-lg mt-1">{viewingInquiry.message}</p>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => setShowInquiryModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Password
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
