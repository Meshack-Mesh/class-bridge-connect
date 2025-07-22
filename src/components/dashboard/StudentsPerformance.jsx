import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, User, BookOpen, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

export const StudentsPerformance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (student) => {
    try {
      const response = await api.get(`/students/${student.registrationNumber}`);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const getPerformanceColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (average) => {
    if (average >= 90) return { label: 'Excellent', variant: 'default', color: 'bg-green-100 text-green-800' };
    if (average >= 80) return { label: 'Good', variant: 'secondary', color: 'bg-blue-100 text-blue-800' };
    if (average >= 70) return { label: 'Average', variant: 'outline', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', variant: 'destructive', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Students Performance Dashboard</span>
          </CardTitle>
          <CardDescription>
            Monitor student progress and track academic performance in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchStudents}>
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const metrics = student.performanceMetrics || {};
              const badge = getPerformanceBadge(metrics.averageGrade || 0);
              
              return (
                <Card 
                  key={student._id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleStudentClick(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{student.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Reg: {student.registrationNumber}
                        </p>
                      </div>
                      <Badge className={badge.color}>
                        {badge.label}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Assignments</span>
                        </div>
                        <span className="text-sm font-medium">
                          {metrics.totalAssignments || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Average Grade</span>
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(metrics.averageGrade || 0)}`}>
                          {metrics.averageGrade ? `${metrics.averageGrade.toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{metrics.completionRate || 0}%</span>
                        </div>
                        <Progress value={metrics.completionRate || 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No students found matching your search.' : 'No students enrolled yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Student View Modal/Sidebar could be added here */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Performance - {selectedStudent.student.username}</CardTitle>
            <CardDescription>
              Registration: {selectedStudent.student.registrationNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedStudent.metrics.totalSubmissions}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedStudent.metrics.gradedSubmissions}
                  </div>
                  <p className="text-sm text-muted-foreground">Graded</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedStudent.metrics.averageGrade ? 
                      `${selectedStudent.metrics.averageGrade.toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Recent Submissions</h4>
              {selectedStudent.submissions.slice(0, 5).map((submission) => (
                <div key={submission._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium">{submission.assignment?.title || 'Assignment'}</h5>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {submission.grade !== undefined ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className={`font-medium ${getPerformanceColor(submission.grade)}`}>
                          {submission.grade}%
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedStudent(null)}
            >
              Close Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};