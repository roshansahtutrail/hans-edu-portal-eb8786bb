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
    name: "Dr. Priya Sharma",
    designation: "Head of Computer Science",
    qualification: "Ph.D. in Computer Science, IIT Delhi",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    specialization: "Artificial Intelligence & Machine Learning"
  },
  {
    id: "2",
    name: "Prof. Rajesh Kumar",
    designation: "Senior Faculty - Web Technologies",
    qualification: "M.Tech in Software Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    specialization: "Full Stack Development & Cloud Computing"
  },
  {
    id: "3",
    name: "Dr. Anita Desai",
    designation: "Faculty - Data Science",
    qualification: "Ph.D. in Statistics, ISI Kolkata",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specialization: "Data Analytics & Business Intelligence"
  },
  {
    id: "4",
    name: "Mr. Vikram Singh",
    designation: "Faculty - Digital Marketing",
    qualification: "MBA, Google Certified Trainer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    specialization: "SEO, SEM & Social Media Marketing"
  }
];

// LocalStorage keys
const COURSES_KEY = "hans_courses";
const FACULTY_KEY = "hans_faculty";
const INQUIRIES_KEY = "hans_inquiries";
const ADMIN_SESSION_KEY = "hans_admin_session";

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

// Admin session
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123"
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
};

export const adminLogin = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
