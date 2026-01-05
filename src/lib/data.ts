// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  price: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  image: string;
  specialization: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: "news" | "notice";
  date: string;
  isImportant: boolean;
}

export type AdminRole = "super_admin" | "editor" | "viewer";

export interface AdminUser {
  username: string;
  password: string;
  role: AdminRole;
  name: string;
}

// Default data
const defaultCourses: Course[] = [
  {
    id: "1",
    title: "Full Stack Web Development",
    description: "Master modern web development with React, Node.js, and MongoDB. Build production-ready applications.",
    duration: "6 Months",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    price: "₹45,000"
  },
  {
    id: "2",
    title: "Data Science & Machine Learning",
    description: "Learn Python, statistics, machine learning algorithms, and data visualization techniques.",
    duration: "8 Months",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    price: "₹55,000"
  },
  {
    id: "3",
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course covering SEO, SEM, social media, and content marketing.",
    duration: "4 Months",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    price: "₹25,000"
  },
  {
    id: "4",
    title: "Cloud Computing with AWS",
    description: "Get certified in AWS cloud services. Learn EC2, S3, Lambda, and cloud architecture.",
    duration: "5 Months",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    price: "₹40,000"
  },
  {
    id: "5",
    title: "UI/UX Design Fundamentals",
    description: "Design stunning user interfaces with Figma. Learn design principles and user research.",
    duration: "3 Months",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    price: "₹20,000"
  },
  {
    id: "6",
    title: "Mobile App Development",
    description: "Build cross-platform mobile apps with React Native. Deploy to iOS and Android.",
    duration: "6 Months",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    price: "₹50,000"
  }
];

const defaultFaculty: Faculty[] = [
  {
    id: "1",
    name: "Mr. Rakesh Chaudhary",
    designation: "Founder And CEO of Hans",
    qualification: "Ph.D. in English",
    image: "https://southzonedemo.netlify.app/101.JPG",
    specialization: "Make the English understandable for everyone"
  },
  {
    id: "2",
    name: "Mr. Kunal Jaiswal",
    designation: "Co-founder of Hans",
    qualification: "Bachelor and Master Degree in Science",
    image: "https://southzonedemo.netlify.app/120.JPG",
    specialization: "Make the science understandable for everyone"
  },
  {
    id: "3",
    name: "Mr. Santosh Chaudhary",
    designation: "Professor of Mathematics",
    qualification: "Ph.D. in Mathematics, Chennai",
    image: "https://southzonedemo.netlify.app/santosh.jpg",
    specialization: "Math Hunter"
  }
];

const defaultNotices: Notice[] = [
  {
    id: "1",
    title: "Admission Open for 2024 Batch",
    content: "We are pleased to announce that admissions are now open for all courses for the 2024 batch. Early bird discount of 10% available until January 31st.",
    type: "notice",
    date: new Date().toISOString(),
    isImportant: true
  },
  {
    id: "2",
    title: "New AI & Machine Learning Course Launched",
    content: "Exciting news! We have launched a comprehensive AI & Machine Learning course with hands-on projects and industry mentorship.",
    type: "news",
    date: new Date(Date.now() - 86400000).toISOString(),
    isImportant: false
  },
  {
    id: "3",
    title: "Campus Placement Drive - TCS",
    content: "TCS will be conducting a campus placement drive on December 15th. All eligible students are requested to register before December 10th.",
    type: "notice",
    date: new Date(Date.now() - 172800000).toISOString(),
    isImportant: true
  }
];

// Default admin users with roles
const defaultAdminUsers: AdminUser[] = [
  { username: "admin", password: "password123", role: "super_admin", name: "Super Admin" },
  { username: "editor", password: "editor123", role: "editor", name: "Content Editor" },
  { username: "viewer", password: "viewer123", role: "viewer", name: "Staff Viewer" }
];

// LocalStorage keys
const COURSES_KEY = "hans_courses";
const FACULTY_KEY = "hans_faculty";
const INQUIRIES_KEY = "hans_inquiries";
const NOTICES_KEY = "hans_notices";
const ADMIN_SESSION_KEY = "hans_admin_session";
const ADMIN_USERS_KEY = "hans_admin_users";

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem(COURSES_KEY)) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
  }
  if (!localStorage.getItem(FACULTY_KEY)) {
    localStorage.setItem(FACULTY_KEY, JSON.stringify(defaultFaculty));
  }
  if (!localStorage.getItem(INQUIRIES_KEY)) {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(NOTICES_KEY)) {
    localStorage.setItem(NOTICES_KEY, JSON.stringify(defaultNotices));
  }
  if (!localStorage.getItem(ADMIN_USERS_KEY)) {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
  }
};

// Courses CRUD
export const getCourses = (): Course[] => {
  const data = localStorage.getItem(COURSES_KEY);
  return data ? JSON.parse(data) : defaultCourses;
};

export const addCourse = (course: Omit<Course, "id">): Course => {
  const courses = getCourses();
  const newCourse = { ...course, id: Date.now().toString() };
  courses.push(newCourse);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  return newCourse;
};

export const updateCourse = (id: string, course: Partial<Course>): Course | null => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], ...course };
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  return courses[index];
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== id);
  if (filtered.length === courses.length) return false;
  localStorage.setItem(COURSES_KEY, JSON.stringify(filtered));
  return true;
};

// Faculty CRUD
export const getFaculty = (): Faculty[] => {
  const data = localStorage.getItem(FACULTY_KEY);
  return data ? JSON.parse(data) : defaultFaculty;
};

export const addFaculty = (faculty: Omit<Faculty, "id">): Faculty => {
  const facultyList = getFaculty();
  const newFaculty = { ...faculty, id: Date.now().toString() };
  facultyList.push(newFaculty);
  localStorage.setItem(FACULTY_KEY, JSON.stringify(facultyList));
  return newFaculty;
};

export const updateFaculty = (id: string, faculty: Partial<Faculty>): Faculty | null => {
  const facultyList = getFaculty();
  const index = facultyList.findIndex(f => f.id === id);
  if (index === -1) return null;
  facultyList[index] = { ...facultyList[index], ...faculty };
  localStorage.setItem(FACULTY_KEY, JSON.stringify(facultyList));
  return facultyList[index];
};

export const deleteFaculty = (id: string): boolean => {
  const facultyList = getFaculty();
  const filtered = facultyList.filter(f => f.id !== id);
  if (filtered.length === facultyList.length) return false;
  localStorage.setItem(FACULTY_KEY, JSON.stringify(filtered));
  return true;
};

// Inquiries CRUD
export const getInquiries = (): Inquiry[] => {
  const data = localStorage.getItem(INQUIRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addInquiry = (inquiry: Omit<Inquiry, "id" | "date">): Inquiry => {
  const inquiries = getInquiries();
  const newInquiry = { 
    ...inquiry, 
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  inquiries.unshift(newInquiry);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  return newInquiry;
};

export const deleteInquiry = (id: string): boolean => {
  const inquiries = getInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(filtered));
  return true;
};

// Notices CRUD
export const getNotices = (): Notice[] => {
  const data = localStorage.getItem(NOTICES_KEY);
  return data ? JSON.parse(data) : defaultNotices;
};

export const addNotice = (notice: Omit<Notice, "id" | "date">): Notice => {
  const notices = getNotices();
  const newNotice = { 
    ...notice, 
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  notices.unshift(newNotice);
  localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
  return newNotice;
};

export const updateNotice = (id: string, notice: Partial<Notice>): Notice | null => {
  const notices = getNotices();
  const index = notices.findIndex(n => n.id === id);
  if (index === -1) return null;
  notices[index] = { ...notices[index], ...notice };
  localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
  return notices[index];
};

export const deleteNotice = (id: string): boolean => {
  const notices = getNotices();
  const filtered = notices.filter(n => n.id !== id);
  if (filtered.length === notices.length) return false;
  localStorage.setItem(NOTICES_KEY, JSON.stringify(filtered));
  return true;
};

// Admin users management
export const getAdminUsers = (): AdminUser[] => {
  const data = localStorage.getItem(ADMIN_USERS_KEY);
  return data ? JSON.parse(data) : defaultAdminUsers;
};

export const updateAdminPassword = (username: string, newPassword: string): boolean => {
  const users = getAdminUsers();
  const index = users.findIndex(u => u.username === username);
  if (index === -1) return false;
  users[index].password = newPassword;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return true;
};

// Admin session
export interface AdminSession {
  username: string;
  role: AdminRole;
  name: string;
}

export const getAdminSession = (): AdminSession | null => {
  const data = localStorage.getItem(ADMIN_SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const isAdminLoggedIn = (): boolean => {
  return getAdminSession() !== null;
};

export const adminLogin = (username: string, password: string): AdminSession | null => {
  const users = getAdminUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const session: AdminSession = { username: user.username, role: user.role, name: user.name };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

// Role-based permissions
export const canEdit = (role: AdminRole): boolean => {
  return role === "super_admin" || role === "editor";
};

export const canDelete = (role: AdminRole): boolean => {
  return role === "super_admin";
};

export const canManageSettings = (role: AdminRole): boolean => {
  return role === "super_admin";
};
