'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';
import { 
  Heart, 
  BookOpen, 
  Clock, 
  Trophy, 
  MessageCircle, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  User,
  Target,
  TrendingUp
} from 'lucide-react';

interface ParentViewProps {
  progressData: any[];
  diagnosticData: any[];
  recommendationData: any[];
}

export default function ParentView({ progressData, diagnosticData, recommendationData }: ParentViewProps) {
  const childData = progressData[0] || {};
  const childDiagnostics = diagnosticData[0] || {};
  const childRecommendations = recommendationData[0] || {};

  const getOverallProgress = () => {
    if (!childData.overallProgress) return 0;
    return childData.overallProgress.averageScore || 0;
  };

  const getWeeklyGoals = () => {
    return [
      { title: 'Complete 3 reading sessions', progress: 2, target: 3, completed: false },
      { title: 'Practice math facts for 15 min daily', progress: 4, target: 7, completed: false },
      { title: 'Submit homework on time', progress: 3, target: 3, completed: true },
    ];
  };

  const getUpcomingActivities = () => {
    return [
      { title: 'Reading Assessment', date: '2024-06-28', type: 'assessment' },
      { title: 'Parent-Teacher Conference', date: '2024-07-02', type: 'meeting' },
      { title: 'Math Skills Practice', date: '2024-06-29', type: 'activity' },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Child Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-500" />
              {childData.studentName || "Your Child"}'s Learning Journey
            </CardTitle>
            <CardDescription>
              Track progress, celebrate achievements, and support growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-purple-600">
                  {getOverallProgress().toFixed(1)}%
                </h3>
                <p className="text-sm text-gray-600">Overall Progress</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {childData.overallProgress?.totalTimeSpent ? 
                    `${Math.round(childData.overallProgress.totalTimeSpent / 60)} min`
                    : '0 min'
                  }
                </div>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
            </div>
            <Progress value={getOverallProgress()} className="h-3 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="font-medium">
                  {childData.overallProgress?.completedCourses || 0}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <div className="font-medium">
                  {childData.overallProgress?.totalCourses || 0}
                </div>
                <div className="text-xs text-gray-600">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Recent Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium mb-2">Reading Milestone!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Completed 10 reading sessions in a row
              </p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Consistency Star
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>How your child is progressing in each subject</CardDescription>
        </CardHeader>
        <CardContent>
          {childData.courseProgress?.length ? (
            <div className="space-y-4">
              {childData.courseProgress.map((course: any, index: number) => (
                <div key={course.courseId || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{course.courseName}</h3>
                        <p className="text-sm text-gray-600">
                          Last activity: {new Date(course.lastAccessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium">{course.completionPercentage}%</div>
                      <Badge variant={
                        course.status === 'in-progress' ? 'default' :
                        course.status === 'completed' ? 'secondary' : 'destructive'
                      }>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={course.completionPercentage} className="h-2" />
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>{Math.round(course.timeSpent / 60)} minutes spent</span>
                    <span>
                      {course.completionPercentage >= 100 ? 'Completed!' :
                       course.completionPercentage >= 75 ? 'Almost there!' :
                       course.completionPercentage >= 50 ? 'Making progress' :
                       'Getting started'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No course progress data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Goals & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              This Week's Goals
            </CardTitle>
            <CardDescription>Help your child achieve their learning targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getWeeklyGoals().map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      goal.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {goal.completed && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <span className="text-sm">{goal.title}</span>
                  </div>
                  <Badge variant={goal.completed ? 'secondary' : 'outline'}>
                    {goal.progress}/{goal.target}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Recommended Actions
            </CardTitle>
            <CardDescription>AI-powered suggestions to support learning</CardDescription>
          </CardHeader>
          <CardContent>
            {childRecommendations.recommendations?.length ? (
              <div className="space-y-3">
                {childRecommendations.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={rec.id || index} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="text-xs text-gray-500">
                      Expected outcome: {rec.expectedOutcome}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new recommendations at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Activities & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-500" />
              Upcoming Activities
            </CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingActivities().map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'assessment' ? 'bg-red-100' :
                      activity.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'assessment' ? 
                        <AlertTriangle className="h-5 w-5 text-red-600" /> :
                        activity.type === 'meeting' ?
                        <User className="h-5 w-5 text-blue-600" /> :
                        <BookOpen className="h-5 w-5 text-green-600" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-600">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secure Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
              Messages from Teachers
            </CardTitle>
            <CardDescription>Secure communication about your child's progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MessageList className="mb-4" />
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Send Message to Teacher</h4>
                <MessageComposer 
                  recipients={[
                    { id: 'teacher-1', name: 'Ms. Johnson', role: 'teacher' },
                    { id: 'teacher-2', name: 'Mr. Smith', role: 'teacher' }
                  ]}
                  onMessageSent={() => {
                    // Refresh message list or show success notification
                    console.log('Message sent successfully');
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Results Summary */}
      {childDiagnostics.diagnosticResults?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
              Recent Assessment Summary
            </CardTitle>
            <CardDescription>
              Understanding your child's learning profile and support needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childDiagnostics.diagnosticResults.slice(0, 2).map((result: any, index: number) => (
                <div key={result.id || index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium capitalize">{result.type} Assessment</h3>
                    <Badge variant="secondary">
                      {result.confidenceLevel} confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{result.summary}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Severity Level:</span>
                      <Badge variant={
                        result.severityLevel === 'mild' ? 'secondary' :
                        result.severityLevel === 'moderate' ? 'default' : 'destructive'
                      }>
                        {result.severityLevel}
                      </Badge>
                    </div>
                    {result.needsIntervention && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-yellow-800">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          Additional support recommended
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
