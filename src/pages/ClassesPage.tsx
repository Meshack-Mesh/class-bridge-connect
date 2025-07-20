import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateClassModal } from "@/components/classes/CreateClassModal";
import { JoinClassModal } from "@/components/classes/JoinClassModal";
import { BookOpen, Users, Calendar, Clock, Plus, UserPlus } from "lucide-react";

// Mock data - replace with API calls
const mockClasses = [
  {
    id: "1",
    name: "Mathematics 101",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    description: "Introduction to advanced mathematics concepts",
    studentCount: 25,
    nextClass: "Mon 10:00 AM",
    schedule: "Mon, Wed, Fri - 10:00 AM",
    color: "#3B82F6",
    isEnrolled: true,
    isActive: true
  },
  {
    id: "2", 
    name: "Physics Fundamentals",
    subject: "Physics",
    teacher: "Prof. Johnson",
    description: "Basic principles of physics and mechanics",
    studentCount: 18,
    nextClass: "Wed 2:00 PM",
    schedule: "Tue, Thu - 2:00 PM",
    color: "#10B981",
    isEnrolled: true,
    isActive: true
  },
  {
    id: "3",
    name: "Chemistry Basics",
    subject: "Chemistry",
    teacher: "Dr. Brown",
    description: "Introduction to chemical reactions and compounds",
    studentCount: 22,
    nextClass: "Thu 9:00 AM",
    schedule: "Mon, Thu - 9:00 AM",
    color: "#F59E0B",
    isEnrolled: false,
    isActive: true
  }
];

const ClassesPage = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  if (!user) return null;

  const enrolledClasses = mockClasses.filter(c => c.isEnrolled);
  const availableClasses = mockClasses.filter(c => !c.isEnrolled);

  const handleCreateClass = async (classData: any) => {
    console.log('Creating class:', classData);
    // TODO: API call to create class
    setShowCreateModal(false);
  };

  const handleJoinClass = async (inviteCode: string) => {
    console.log('Joining class with code:', inviteCode);
    // TODO: API call to join class
    setShowJoinModal(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Classes</h1>
            <p className="text-muted-foreground">
              {user.role === 'teacher' 
                ? "Manage your classes and track student progress"
                : "View your enrolled classes and discover new ones"
              }
            </p>
          </div>
          <div className="flex space-x-2">
            {user.role === 'teacher' ? (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            ) : (
              <Button onClick={() => setShowJoinModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Class
              </Button>
            )}
          </div>
        </div>

        {user.role === 'student' ? (
          <Tabs defaultValue="enrolled" className="w-full">
            <TabsList>
              <TabsTrigger value="enrolled">My Classes ({enrolledClasses.length})</TabsTrigger>
              <TabsTrigger value="available">Available Classes ({availableClasses.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="enrolled" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledClasses.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{classItem.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Teacher: {classItem.teacher}
                          </CardDescription>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: classItem.color }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {classItem.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{classItem.studentCount} students</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{classItem.schedule}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Next: {classItem.nextClass}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button className="w-full" size="sm">
                          View Class Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {enrolledClasses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Classes Enrolled</h3>
                  <p className="text-muted-foreground mb-4">
                    Join your first class to get started with learning
                  </p>
                  <Button onClick={() => setShowJoinModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join a Class
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableClasses.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{classItem.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Teacher: {classItem.teacher}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{classItem.subject}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {classItem.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{classItem.studentCount} students enrolled</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{classItem.schedule}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button className="w-full" size="sm" variant="outline">
                          Request to Join
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {classItem.subject}
                      </CardDescription>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: classItem.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {classItem.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem.studentCount} students</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem.schedule}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Next: {classItem.nextClass}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Button className="w-full" size="sm">
                      Manage Class
                    </Button>
                    <Button className="w-full" size="sm" variant="outline">
                      View Students
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {mockClasses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Classes Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first class to start teaching
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Class
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
        />
        
        <JoinClassModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinClass}
        />
      </div>
      </div>
    </Layout>
  );
};

export default ClassesPage;