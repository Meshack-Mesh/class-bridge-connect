import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { CreateClassModal } from "@/components/classes/CreateClassModal";
import { CreateAssignmentModal } from "@/components/assignments/CreateAssignmentModal";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";

// Remove hardcoded data - will fetch from backend
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix: Move navigation to useEffect to prevent render-time navigation
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Fetch data from backend
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user's classes and assignments from backend
        const [classesData, assignmentsData] = await Promise.all([
          // Replace with actual API calls
          Promise.resolve([]), // classesAPI.getClasses()
          Promise.resolve([])  // assignmentsAPI.getAssignments()
        ]);
        
        setClasses(classesData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {user.role === 'student' ? (
        <StudentDashboard
          user={user}
          classes={classes}
          assignments={assignments}
          onViewClass={handleViewClass}
          onViewAssignment={handleViewAssignment}
        />
      ) : (
        <TeacherDashboard
          user={user}
          classes={classes}
          assignments={assignments}
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
        classes={classes}
      />
    </Layout>
  );
};

export default DashboardPage;