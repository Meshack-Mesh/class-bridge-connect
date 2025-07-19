import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Calendar, Clock, CheckCircle, AlertTriangle, 
  Users, MoreVertical, Edit, Trash2, Eye 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Assignment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";

interface AssignmentCardProps {
  assignment: Assignment;
  onViewAssignment: (assignmentId: string) => void;
  onEditAssignment?: (assignmentId: string) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  onSubmitAssignment?: (assignmentId: string) => void;
  showSubmissionStatus?: boolean;
}

export const AssignmentCard = ({ 
  assignment, 
  onViewAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onSubmitAssignment,
  showSubmissionStatus = false
}: AssignmentCardProps) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isOwnAssignment = isTeacher && assignment.teacher._id === user?._id;
  
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isAfter(now, dueDate);
  const daysUntilDue = differenceInDays(dueDate, now);
  
  // For teacher view - calculate submission stats
  const submissionRate = assignment.submissions.length > 0 
    ? (assignment.submissions.length / assignment.class.students.length) * 100 
    : 0;
    
  const gradedCount = assignment.submissions.filter(s => s.grade !== undefined).length;
  const pendingGrading = assignment.submissions.length - gradedCount;
  
  // For student view - find their submission
  const mySubmission = assignment.submissions.find(s => s.student._id === user?._id);
  
  const getStatusBadge = () => {
    if (isTeacher) {
      if (pendingGrading > 0) {
        return (
          <Badge variant="outline" className="text-accent border-accent">
            <Clock className="h-3 w-3 mr-1" />
            {pendingGrading} to grade
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="text-success border-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          All graded
        </Badge>
      );
    } else {
      if (!mySubmission) {
        if (isOverdue) {
          return (
            <Badge variant="outline" className="text-destructive border-destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-accent border-accent">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      }
      
      if (mySubmission.grade !== undefined) {
        return (
          <Badge variant="outline" className="text-success border-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            {mySubmission.grade}/{assignment.maxGrade}
          </Badge>
        );
      }
      
      return (
        <Badge variant="outline" className="text-primary border-primary">
          <CheckCircle className="h-3 w-3 mr-1" />
          Submitted
        </Badge>
      );
    }
  };

  const getDueDateColor = () => {
    if (isOverdue) return 'text-destructive';
    if (daysUntilDue <= 1) return 'text-accent';
    if (daysUntilDue <= 3) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className="hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer"
                       onClick={() => onViewAssignment(assignment._id)}>
              {assignment.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {assignment.class.name} • {assignment.class.subject}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            
            {(isOwnAssignment || (!isTeacher && !mySubmission && !isOverdue)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-md">
                  <DropdownMenuItem onClick={() => onViewAssignment(assignment._id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  
                  {isOwnAssignment && onEditAssignment && (
                    <DropdownMenuItem onClick={() => onEditAssignment(assignment._id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Assignment
                    </DropdownMenuItem>
                  )}
                  
                  {!isTeacher && !mySubmission && !isOverdue && onSubmitAssignment && (
                    <DropdownMenuItem onClick={() => onSubmitAssignment(assignment._id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </DropdownMenuItem>
                  )}
                  
                  {isOwnAssignment && onDeleteAssignment && (
                    <DropdownMenuItem 
                      onClick={() => onDeleteAssignment(assignment._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Assignment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assignment.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-1 ${getDueDateColor()}`}>
              <Calendar className="h-3 w-3" />
              <span>Due: {format(dueDate, 'MMM dd, yyyy HH:mm')}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <span>{assignment.maxGrade} points</span>
            </div>
          </div>
          
          {isTeacher && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Submissions: {assignment.submissions.length}/{assignment.class.students.length}</span>
                <span>{Math.round(submissionRate)}%</span>
              </div>
              <Progress value={submissionRate} className="h-1" />
            </div>
          )}
          
          {!isTeacher && mySubmission && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Submitted: {format(new Date(mySubmission.submittedAt!), 'MMM dd, yyyy HH:mm')}
                </span>
                {mySubmission.status === 'late' && (
                  <Badge variant="outline" className="text-destructive border-destructive text-xs">
                    Late
                  </Badge>
                )}
              </div>
              {mySubmission.feedback && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  Feedback: {mySubmission.feedback}
                </p>
              )}
            </div>
          )}
          
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{assignment.attachments.length} attachment(s)</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewAssignment(assignment._id)}
          >
            View Details
          </Button>
          
          {!isTeacher && !mySubmission && !isOverdue && onSubmitAssignment && (
            <Button 
              size="sm"
              onClick={() => onSubmitAssignment(assignment._id)}
            >
              Submit Assignment
            </Button>
          )}
          
          {!isTeacher && mySubmission && mySubmission.grade === undefined && (
            <Badge variant="outline" className="text-primary border-primary">
              Awaiting Grade
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};