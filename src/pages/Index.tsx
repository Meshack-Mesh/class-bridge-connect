import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, MessageSquare, Award } from "lucide-react";

// Mock data - replace with API calls to your MERN backend
type User = {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
};

const mockUser: User = {
  name: "John Doe",
  email: "john@example.com",
  role: "student"
};

const mockClasses = [
  {
    id: "1",
    name: "Mathematics 101",
    teacher: "Dr. Smith",
    studentCount: 25,
    nextClass: "Mon 10:00 AM",
    nextSession: "Mon 10:00 AM",
    recentActivity: "2 new assignments posted",
    color: "#3B82F6"
  },
  {
    id: "2", 
    name: "Physics Fundamentals",
    teacher: "Prof. Johnson",
    studentCount: 18,
    nextClass: "Wed 2:00 PM",
    nextSession: "Wed 2:00 PM",
    recentActivity: "Quiz results available",
    color: "#10B981"
  }
];

const mockAssignments = [
  {
    id: "1",
    title: "Algebra Problem Set 3",
    className: "Mathematics 101",
    dueDate: "March 15, 2024",
    status: "pending" as const,
    submissionsCount: 12,
    totalStudents: 25,
    gradedCount: 8
  },
  {
    id: "2",
    title: "Newton's Laws Lab Report", 
    className: "Physics Fundamentals",
    dueDate: "March 20, 2024",
    status: "submitted" as const,
    submissionsCount: 15,
    totalStudents: 18,
    gradedCount: 15
  }
];

const Index = () => {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (data: { 
    email: string; 
    password: string; 
    role?: string; 
    name?: string; 
    action: 'login' | 'register' 
  }) => {
    setIsLoading(true);
    
    // TODO: Replace with actual API calls to your MERN backend
    console.log('Auth attempt:', data);
    
    // Simulate API call
    setTimeout(() => {
      if (data.action === 'login') {
        // Mock login - replace with real JWT authentication
        setUser({
          name: "John Doe",
          email: data.email,
          role: data.email.includes('teacher') ? 'teacher' : 'student'
        });
      } else {
        // Mock registration - replace with real user creation
        setUser({
          name: data.name!,
          email: data.email,
          role: data.role as 'student' | 'teacher'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    // TODO: Clear JWT token and call logout API
  };

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <Header onAuthAction={(action) => action === 'login' && setUser(mockUser)} />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-accent rounded-full">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Smart Education <span className="text-primary">Collaboration</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect teachers and students in a managed virtual classroom environment. 
              Share resources, manage assignments, and track progress together.
            </p>
            <Button 
              size="lg" 
              className="shadow-[var(--shadow-button)]"
              onClick={() => setUser(mockUser)}
            >
              Get Started Today
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-card rounded-lg shadow-[var(--shadow-card)]">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Class Management</h3>
              <p className="text-muted-foreground">
                Create and manage virtual classrooms with ease
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-[var(--shadow-card)]">
              <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Student Collaboration</h3>
              <p className="text-muted-foreground">
                Foster collaboration between students and teachers
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-[var(--shadow-card)]">
              <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor student progress and performance analytics
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-[var(--shadow-card)]">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Communication</h3>
              <p className="text-muted-foreground">
                Stay connected with instant messaging and updates
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Education?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of educators already using EduConnect
            </p>
            <LoginForm onSubmit={handleAuth} isLoading={isLoading} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthAction={(action) => action === 'logout' && handleLogout()} 
      />
      
      {user.role === 'student' ? (
        <StudentDashboard
          user={user}
          classes={mockClasses}
          assignments={mockAssignments}
          onViewClass={(id) => console.log('View class:', id)}
          onViewAssignment={(id) => console.log('View assignment:', id)}
        />
      ) : (
        <TeacherDashboard
          user={user}
          classes={mockClasses}
          assignments={mockAssignments}
          onCreateClass={() => console.log('Create class')}
          onCreateAssignment={() => console.log('Create assignment')}
          onViewClass={(id) => console.log('View class:', id)}
          onViewAssignment={(id) => console.log('View assignment:', id)}
        />
      )}
    </div>
  );
};

export default Index;
