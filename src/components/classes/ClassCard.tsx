import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MoreVertical, Settings, UserMinus, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Class } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface ClassCardProps {
  classData: Class;
  onViewClass: (classId: string) => void;
  onEditClass?: (classId: string) => void;
  onLeaveClass?: (classId: string) => void;
  onManageStudents?: (classId: string) => void;
  onViewAnnouncements?: (classId: string) => void;
}

export const ClassCard = ({ 
  classData, 
  onViewClass, 
  onEditClass,
  onLeaveClass,
  onManageStudents,
  onViewAnnouncements
}: ClassCardProps) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isOwnClass = isTeacher && classData.teacher._id === user?._id;

  const getNextSession = () => {
    if (!classData.schedule || classData.schedule.length === 0) {
      return 'No schedule set';
    }
    // Simple logic to show next session - can be enhanced
    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextSession = classData.schedule[0];
    return `${nextSession.day} ${nextSession.time}`;
  };

  return (
    <Card className="hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onViewClass(classData._id)}>
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: classData.color }}
              />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {classData.name}
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              {classData.subject} • {classData.description}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border shadow-md">
              <DropdownMenuItem onClick={() => onViewClass(classData._id)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                View Class
              </DropdownMenuItem>
              {onViewAnnouncements && (
                <DropdownMenuItem onClick={() => onViewAnnouncements(classData._id)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Announcements
                </DropdownMenuItem>
              )}
              {isOwnClass && onEditClass && (
                <DropdownMenuItem onClick={() => onEditClass(classData._id)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Class
                </DropdownMenuItem>
              )}
              {isOwnClass && onManageStudents && (
                <DropdownMenuItem onClick={() => onManageStudents(classData._id)}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Students
                </DropdownMenuItem>
              )}
              {!isOwnClass && onLeaveClass && (
                <DropdownMenuItem 
                  onClick={() => onLeaveClass(classData._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave Class
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={() => onViewClass(classData._id)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{classData.students.length} students</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {classData.subject}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Next: {getNextSession()}</span>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Teacher: <span className="text-foreground font-medium">{classData.teacher.name}</span>
            </p>
            {isOwnClass && (
              <p className="text-xs text-primary mt-1">
                Invite Code: <span className="font-mono bg-muted px-2 py-1 rounded">{classData.inviteCode}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};