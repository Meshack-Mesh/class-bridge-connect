import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { CreateClassModal } from "@/components/classes/CreateClassModal";
import { CreateAssignmentModal } from "@/components/assignments/CreateAssignmentModal";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";

// Mock data - replace with API calls
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

// Full Class objects for modals that need complete type
const mockClassesForModal = [
  {
    _id: "1",
    name: "Mathematics 101",
    subject: "Mathematics", 
    description: "Advanced mathematics course",
    teacher: { _id: "t1", name: "Dr. Smith", email: "smith@school.edu", role: "teacher" as const, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    students: [],
    inviteCode: "MATH01",
    color: "#3B82F6",
    schedule: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    _id: "2",
    name: "Physics Fundamentals", 
    subject: "Physics",
    description: "Basic physics principles",
    teacher: { _id: "t2", name: "Prof. Johnson", email: "johnson@school.edu", role: "teacher" as const, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    students: [],
    inviteCode: "PHYS01", 
    color: "#10B981",
    schedule: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
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

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleCreateClass = () => {
    setShowCreateClassModal(true);
  };

  const handleCreateAssignment = () => {
    setShowCreateAssignmentModal(true);
  };

  const handleSubmitClass = async (classData: any) => {
    console.log('Creating class:', classData);
    // TODO: API call to create class
    setShowCreateClassModal(false);
  };

  const handleSubmitAssignment = async (assignmentData: any) => {
    console.log('Creating assignment:', assignmentData);
    // TODO: API call to create assignment
    setShowCreateAssignmentModal(false);
  };

  const handleViewClass = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const handleViewAssignment = (assignmentId: string) => {
    navigate(`/assignments/${assignmentId}`);
  };

  return (
    <Layout>
      {user.role === 'student' ? (
        <StudentDashboard
          user={user}
          classes={mockClasses}
          assignments={mockAssignments}
          onViewClass={handleViewClass}
          onViewAssignment={handleViewAssignment}
        />
      ) : (
        <TeacherDashboard
          user={user}
          classes={mockClasses}
          assignments={mockAssignments}
          onCreateClass={handleCreateClass}
          onCreateAssignment={handleCreateAssignment}
          onViewClass={handleViewClass}
          onViewAssignment={handleViewAssignment}
        />
      )}

      {/* Modals */}
      <CreateClassModal
        open={showCreateClassModal}
        onOpenChange={setShowCreateClassModal}
        onSubmit={handleSubmitClass}
      />
      
      <CreateAssignmentModal
        open={showCreateAssignmentModal}
        onOpenChange={setShowCreateAssignmentModal}
        onSubmit={handleSubmitAssignment}
        classes={mockClassesForModal}
      />
    </Layout>
  );
};

export default DashboardPage;