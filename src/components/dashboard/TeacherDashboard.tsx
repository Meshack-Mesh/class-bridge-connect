import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, FileText, Plus, Calendar, CheckCircle, Clock, BarChart3 } from "lucide-react";

interface Class {
  id: string;
  name: string;
  studentCount: number;
  nextSession: string;
  recentActivity: string;
  color: string;
}

interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
  gradedCount: number;
}

interface TeacherDashboardProps {
  user: {
    name: string;
    email: string;
  };
  classes: Class[];
  assignments: Assignment[];
  onCreateClass: () => void;
  onCreateAssignment: () => void;
  onViewClass: (classId: string) => void;
  onViewAssignment: (assignmentId: string) => void;
}

export const TeacherDashboard = ({ 
  user, 
  classes, 
  assignments, 
  onCreateClass, 
  onCreateAssignment,
  onViewClass, 
  onViewAssignment 
}: TeacherDashboardProps) => {
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const pendingGrading = assignments.filter(a => a.gradedCount < a.submissionsCount).length;
  const averageSubmissionRate = assignments.length ? 
    assignments.reduce((sum, a) => sum + (a.submissionsCount / a.totalStudents), 0) / assignments.length * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name}! 👨‍🏫
            </h1>
            <p className="text-muted-foreground">
              Manage your classes and inspire your students
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onCreateClass} className="shadow-[var(--shadow-button)]">
              <Plus className="h-4 w-4 mr-2" />
              New Class
            </Button>
            <Button onClick={onCreateAssignment} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classes.length}</div>
              <p className="text-xs text-muted-foreground">
                Active classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{pendingGrading}</div>
              <p className="text-xs text-muted-foreground">
                Assignments to grade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submission Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(averageSubmissionRate)}%</div>
              <Progress value={averageSubmissionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Classes</span>
                </div>
                <Button size="sm" variant="outline" onClick={onCreateClass}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Class
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your classes and track student progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map((classItem) => (
                <div 
                  key={classItem.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewClass(classItem.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{classItem.studentCount} students</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {classItem.nextSession}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {classItem.recentActivity}
                      </p>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: classItem.color }}
                    />
                  </div>
                </div>
              ))}
              {classes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No classes created yet</p>
                  <Button variant="outline" className="mt-2" size="sm" onClick={onCreateClass}>
                    Create Your First Class
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Assignments</span>
                </div>
                <Button size="sm" variant="outline" onClick={onCreateAssignment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Assignment
                </Button>
              </CardTitle>
              <CardDescription>
                Track assignment submissions and grading progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div 
                  key={assignment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewAssignment(assignment.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">{assignment.className}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {assignment.dueDate}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Submissions: {assignment.submissionsCount}/{assignment.totalStudents}</span>
                          <span>{Math.round((assignment.submissionsCount / assignment.totalStudents) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(assignment.submissionsCount / assignment.totalStudents) * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
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
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No assignments created yet</p>
                  <Button variant="outline" className="mt-2" size="sm" onClick={onCreateAssignment}>
                    Create Your First Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};