import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CreateAssignmentModal } from "@/components/assignments/CreateAssignmentModal";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Download,
  Upload,
  Calendar
} from "lucide-react";

// Mock data - replace with API calls
const mockAssignments = [
  {
    id: "1",
    title: "Algebra Problem Set 3",
    description: "Solve advanced algebraic equations and show your work",
    className: "Mathematics 101",
    classId: "1",
    dueDate: "March 15, 2024",
    createdDate: "March 1, 2024",
    status: "pending" as const,
    submissionsCount: 12,
    totalStudents: 25,
    gradedCount: 8,
    maxPoints: 100,
    attachments: ["problem_set_3.pdf"],
    isSubmitted: false,
    grade: null
  },
  {
    id: "2",
    title: "Newton's Laws Lab Report", 
    description: "Complete lab report on Newton's three laws of motion",
    className: "Physics Fundamentals",
    classId: "2",
    dueDate: "March 20, 2024",
    createdDate: "March 5, 2024",
    status: "submitted" as const,
    submissionsCount: 15,
    totalStudents: 18,
    gradedCount: 15,
    maxPoints: 50,
    attachments: ["lab_instructions.pdf", "data_sheet.xlsx"],
    isSubmitted: true,
    grade: 85
  },
  {
    id: "3",
    title: "Chemical Bonding Essay",
    description: "Write a 500-word essay on ionic and covalent bonding",
    className: "Chemistry Basics",
    classId: "3",
    dueDate: "March 25, 2024",
    createdDate: "March 10, 2024",
    status: "graded" as const,
    submissionsCount: 20,
    totalStudents: 22,
    gradedCount: 20,
    maxPoints: 75,
    attachments: [],
    isSubmitted: true,
    grade: 92
  }
];

const AssignmentsPage = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user) return null;

  const pendingAssignments = mockAssignments.filter(a => !a.isSubmitted && a.status === 'pending');
  const submittedAssignments = mockAssignments.filter(a => a.isSubmitted);
  const needsGrading = mockAssignments.filter(a => a.gradedCount < a.submissionsCount);

  const handleCreateAssignment = async (assignmentData: any) => {
    console.log('Creating assignment:', assignmentData);
    // TODO: API call to create assignment
    setShowCreateModal(false);
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    console.log('Submit assignment:', assignmentId);
    // TODO: Open file upload modal
  };

  const handleViewSubmissions = (assignmentId: string) => {
    console.log('View submissions for:', assignmentId);
    // TODO: Navigate to submissions page
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Assignments</h1>
            <p className="text-muted-foreground">
              {user.role === 'teacher' 
                ? "Create and manage assignments for your classes"
                : "View and submit your assignments"
              }
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>

        {user.role === 'student' ? (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="submitted">
                Submitted ({submittedAssignments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.className} • Due: {assignment.dueDate}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-accent border-accent">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {assignment.createdDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{assignment.maxPoints} points</span>
                          </div>
                        </div>
                      </div>

                      {assignment.attachments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Attachments:</p>
                          <div className="space-y-1">
                            {assignment.attachments.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{file}</span>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleSubmitAssignment(assignment.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                        <Button variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {pendingAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">
                      You have no pending assignments. Great job!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="submitted" className="mt-6">
              <div className="space-y-4">
                {submittedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.className} • Submitted on time
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {assignment.grade ? (
                            <Badge variant="outline" className="text-success border-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {assignment.grade}/{assignment.maxPoints}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-primary border-primary">
                              <Clock className="h-3 w-3 mr-1" />
                              Submitted
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Due: {assignment.dueDate}</span>
                          <span>{assignment.maxPoints} points</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Submission
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Teacher view
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Assignments ({mockAssignments.length})</TabsTrigger>
              <TabsTrigger value="grading">Need Grading ({needsGrading.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.className} • Due: {assignment.dueDate}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {assignment.gradedCount < assignment.submissionsCount && (
                            <Badge variant="outline" className="text-accent border-accent">
                              <Clock className="h-3 w-3 mr-1" />
                              {assignment.submissionsCount - assignment.gradedCount} to grade
                            </Badge>
                          )}
                          {assignment.gradedCount === assignment.submissionsCount && assignment.submissionsCount > 0 && (
                            <Badge variant="outline" className="text-success border-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              All graded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {assignment.description}
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>Submissions: {assignment.submissionsCount}/{assignment.totalStudents}</span>
                          <span>{Math.round((assignment.submissionsCount / assignment.totalStudents) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(assignment.submissionsCount / assignment.totalStudents) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Created: {assignment.createdDate}</span>
                          <span>{assignment.maxPoints} points</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewSubmissions(assignment.id)}
                          >
                            View Submissions
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit Assignment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {mockAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments Created</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first assignment to get started
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Assignment
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="grading" className="mt-6">
              <div className="space-y-4">
                {needsGrading.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow border-accent/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.className} • {assignment.submissionsCount - assignment.gradedCount} submissions need grading
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-accent border-accent">
                          <Clock className="h-3 w-3 mr-1" />
                          Needs Grading
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Due: {assignment.dueDate} • {assignment.maxPoints} points
                        </div>
                        <Button onClick={() => handleViewSubmissions(assignment.id)}>
                          Grade Submissions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {needsGrading.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">All Assignments Graded!</h3>
                    <p className="text-muted-foreground">
                      Great job! All submitted assignments have been graded.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Create Assignment Modal */}
        <CreateAssignmentModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={handleCreateAssignment}
          classes={[]}
        />
      </div>
    </div>
  );
};

export default AssignmentsPage;