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
  X
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
  initializeData,
  Course,
  Faculty,
  Inquiry,
} from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "courses" | "faculty" | "inquiries";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
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

  useEffect(() => {
    initializeData();
    setIsLoggedIn(isAdminLoggedIn());
    loadData();
  }, []);

  const loadData = () => {
    setCourses(getCourses());
    setFaculty(getFaculty());
    setInquiries(getInquiries());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(username, password)) {
      setIsLoggedIn(true);
      toast({ title: "Login Successful", description: "Welcome to the admin panel." });
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
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

  if (!isLoggedIn) {
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
                <p className="text-xs text-muted-foreground">Hans Educational Institute</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                View Website
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-card p-2 rounded-xl border border-border w-fit">
          {[
            { id: "courses" as Tab, label: "Courses", icon: BookOpen },
            { id: "faculty" as Tab, label: "Faculty", icon: Users },
            { id: "inquiries" as Tab, label: "Inquiries", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={cn(
                "ml-1 text-xs px-2 py-0.5 rounded-full",
                activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {tab.id === "courses" ? courses.length : tab.id === "faculty" ? faculty.length : inquiries.length}
              </span>
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Manage Courses</h2>
              <Button onClick={() => openCourseModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openCourseModal(course)}>
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
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
              <Button onClick={() => openFacultyModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Faculty
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map((member) => (
                <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{member.designation}</p>
                    <p className="text-xs text-muted-foreground mb-3">{member.specialization}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openFacultyModal(member)}>
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteFaculty(member.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteInquiry(inquiry.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
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
    </div>
  );
};

export default Admin;
