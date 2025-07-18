import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle, AlertCircle, Users, Calendar } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface Class {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  nextClass: string;
  color: string;
}

interface StudentDashboardProps {
  user: {
    name: string;
    email: string;
  };
  classes: Class[];
  assignments: Assignment[];
  onViewClass: (classId: string) => void;
  onViewAssignment: (assignmentId: string) => void;
}

export const StudentDashboard = ({ 
  user, 
  classes, 
  assignments, 
  onViewClass, 
  onViewAssignment 
}: StudentDashboardProps) => {
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const completedAssignments = assignments.filter(a => a.status !== 'pending');
  const completionRate = assignments.length ? (completedAssignments.length / assignments.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classes.length}</div>
              <p className="text-xs text-muted-foreground">
                Classes enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{pendingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">
                Due soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{Math.round(completionRate)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>My Classes</span>
              </CardTitle>
              <CardDescription>
                Your enrolled classes and upcoming sessions
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
                      <p className="text-sm text-muted-foreground">
                        Teacher: {classItem.teacher}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{classItem.studentCount} students</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {classItem.nextClass}</span>
                        </div>
                      </div>
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
                  <p>No classes enrolled yet</p>
                  <Button variant="outline" className="mt-2" size="sm">
                    Browse Classes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Assignments</span>
              </CardTitle>
              <CardDescription>
                Your latest assignments and deadlines
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
                    </div>
                    <div className="flex items-center space-x-2">
                      {assignment.status === 'pending' && (
                        <Badge variant="outline" className="text-accent border-accent">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {assignment.status === 'submitted' && (
                        <Badge variant="outline" className="text-primary border-primary">
                          <Clock className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                      {assignment.status === 'graded' && (
                        <Badge variant="outline" className="text-success border-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {assignment.grade}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No assignments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};