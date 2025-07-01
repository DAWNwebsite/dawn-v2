'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/dashboard/MessageList';
import { MessageComposer } from '@/components/dashboard/MessageComposer';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  GraduationCap,
  FileText,
  MessageSquare,
  Target,
  Brain,
  Eye,
  Star,
  Calendar
} from 'lucide-react';

interface TeacherViewProps {
  progressData: any[];
  diagnosticData: any[];
  recommendationData: any[];
}

export default function TeacherView({ progressData, diagnosticData, recommendationData }: TeacherViewProps) {
  
  const getClassOverview = () => {
    const totalStudents = progressData.length;
    const avgProgress = progressData.reduce((sum, student) => 
      sum + (student.overallProgress?.averageScore || 0), 0) / totalStudents || 0;
    
    const studentsNeedingAttention = recommendationData.filter(student => 
      student.urgentAlerts?.some((alert: any) => alert.severity === 'high' || alert.severity === 'critical')
    ).length;

    return {
      totalStudents,
      avgProgress: Math.round(avgProgress),
      studentsNeedingAttention,
      onTrack: totalStudents - studentsNeedingAttention
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Teacher Dashboard
          </CardTitle>
          <CardDescription>Professional view of your classroom progress and student needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {progressData.length}
              </div>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                75%
              </div>
              <p className="text-sm text-gray-600">Class Average</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                3
              </div>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                12
              </div>
              <p className="text-sm text-gray-600">On Track</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
