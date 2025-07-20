import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Megaphone, 
  Plus, 
  MessageSquare, 
  Clock, 
  User,
  Send
} from "lucide-react";

// Mock data - replace with API calls
const mockAnnouncements = [
  {
    id: "1",
    title: "Midterm Exam Schedule",
    content: "The midterm examinations will be held from March 20-25. Please check your individual class schedules for specific dates and times.",
    author: "Dr. Smith",
    className: "Mathematics 101",
    classId: "1",
    createdAt: "2024-03-10T10:00:00Z",
    isImportant: true,
    comments: [
      {
        id: "1",
        author: "John Doe",
        content: "Will the exam be online or in-person?",
        createdAt: "2024-03-10T11:00:00Z"
      },
      {
        id: "2", 
        author: "Dr. Smith",
        content: "The exam will be in-person in the usual classroom.",
        createdAt: "2024-03-10T11:30:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Lab Session Cancelled",
    content: "Tomorrow's physics lab session has been cancelled due to equipment maintenance. We'll reschedule for next week.",
    author: "Prof. Johnson",
    className: "Physics Fundamentals", 
    classId: "2",
    createdAt: "2024-03-09T15:00:00Z",
    isImportant: false,
    comments: []
  },
  {
    id: "3",
    title: "New Study Materials Available",
    content: "I've uploaded additional study materials for Chapter 5 to the class resources. Please review them before our next session.",
    author: "Dr. Brown",
    className: "Chemistry Basics",
    classId: "3", 
    createdAt: "2024-03-08T09:00:00Z",
    isImportant: false,
    comments: [
      {
        id: "3",
        author: "Jane Smith",
        content: "Thank you! These will be very helpful.",
        createdAt: "2024-03-08T10:00:00Z"
      }
    ]
  }
];

const mockClasses = [
  { id: "1", name: "Mathematics 101" },
  { id: "2", name: "Physics Fundamentals" },
  { id: "3", name: "Chemistry Basics" }
];

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    classId: "",
    isImportant: false
  });
  const [newComment, setNewComment] = useState("");
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  if (!user) return null;

  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', newAnnouncement);
    // TODO: API call to create announcement
    setNewAnnouncement({ title: "", content: "", classId: "", isImportant: false });
    setShowCreateForm(false);
  };

  const handleAddComment = (announcementId: string) => {
    console.log('Adding comment to', announcementId, ':', newComment);
    // TODO: API call to add comment
    setNewComment("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Announcements</h1>
            <p className="text-muted-foreground">
              {user.role === 'teacher' 
                ? "Share important updates with your students"
                : "Stay updated with the latest announcements from your teachers"
              }
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          )}
        </div>

        {/* Create Announcement Form */}
        {showCreateForm && user.role === 'teacher' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>
                Share important information with your students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="class-select">Select Class</Label>
                <Select 
                  value={newAnnouncement.classId} 
                  onValueChange={(value) => setNewAnnouncement({...newAnnouncement, classId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Write your announcement..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={newAnnouncement.isImportant}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, isImportant: e.target.checked})}
                />
                <Label htmlFor="important">Mark as important</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateAnnouncement}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-6">
          {mockAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      {announcement.isImportant && (
                        <Badge variant="destructive">
                          <Megaphone className="h-3 w-3 mr-1" />
                          Important
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span>{announcement.className}</span>
                      <span>•</span>
                      <span>By {announcement.author}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(announcement.createdAt)}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  {announcement.content}
                </p>

                {/* Comments Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{announcement.comments.length} comments</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAnnouncement(
                        expandedAnnouncement === announcement.id ? null : announcement.id
                      )}
                    >
                      {expandedAnnouncement === announcement.id ? 'Hide' : 'Show'} Comments
                    </Button>
                  </div>

                  {expandedAnnouncement === announcement.id && (
                    <div className="space-y-4">
                      {/* Existing Comments */}
                      {announcement.comments.map((comment) => (
                        <div key={comment.id} className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}

                      {/* Add Comment */}
                      {user.role === 'student' && (
                        <div className="flex space-x-2">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1"
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleAddComment(announcement.id)}
                            disabled={!newComment.trim()}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {mockAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements</h3>
              <p className="text-muted-foreground">
                {user.role === 'teacher' 
                  ? "Create your first announcement to share updates with students"
                  : "No announcements from your teachers yet"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
