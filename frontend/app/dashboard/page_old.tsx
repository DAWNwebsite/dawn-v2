'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  User, 
  GraduationCap, 
  Settings, 
  Bell, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  BookOpen,
  Users,
  Target
} from 'lucide-react';
import ParentView from '@/components/dashboard/ParentView';
import TeacherView from '@/components/dashboard/TeacherView';
import AdminView from '@/components/dashboard/AdminView';

// Types for our dashboard data
interface DashboardData {
  progress: any[];
  diagnostics: any[];
  recommendations: any[];
}

interface LoadingState {
  progress: boolean;
  diagnostics: boolean;
  recommendations: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    progress: [],
    diagnostics: [],
    recommendations: []
  });
  const [loading, setLoading] = useState<LoadingState>({
    progress: true,
    diagnostics: true,
    recommendations: true
  });
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all dashboard data in parallel
        const [progressRes, diagnosticsRes, recommendationsRes] = await Promise.all([
          fetch('/api/dashboard/progress'),
          fetch('/api/dashboard/diagnostics'),
          fetch('/api/dashboard/recommendations')
        ]);

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setDashboardData(prev => ({ ...prev, progress: progressData.data?.progress || [] }));
        }
        setLoading(prev => ({ ...prev, progress: false }));

        if (diagnosticsRes.ok) {
          const diagnosticsData = await diagnosticsRes.json();
          setDashboardData(prev => ({ ...prev, diagnostics: diagnosticsData.data?.diagnostics || [] }));
        }
        setLoading(prev => ({ ...prev, diagnostics: false }));

        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json();
          setDashboardData(prev => ({ ...prev, recommendations: recommendationsData.data?.recommendations || [] }));
        }
        setLoading(prev => ({ ...prev, recommendations: false }));

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading({ progress: false, diagnostics: false, recommendations: false });
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const userRole = (session?.user as any)?.role || 'student';
  const userName = session?.user?.name || 'User';

  // Loading state
  const isLoading = loading.progress || loading.diagnostics || loading.recommendations;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Loading your data...</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get role-specific icon and welcome message
  const getRoleInfo = () => {
    switch (userRole) {
      case 'parent':
        return {
          icon: <User className="h-5 w-5" />,
          title: `Welcome back, ${userName}`,
          subtitle: "Here's your child's learning progress"
        };
      case 'teacher':
        return {
          icon: <GraduationCap className="h-5 w-5" />,
          title: `Welcome, ${userName}`,
          subtitle: "Monitor your students' progress and needs"
        };
      case 'admin':
        return {
          icon: <Settings className="h-5 w-5" />,
          title: `Admin Dashboard - ${userName}`,
          subtitle: "Platform overview and management"
        };
      default:
        return {
          icon: <User className="h-5 w-5" />,
          title: `Welcome, ${userName}`,
          subtitle: "Your learning dashboard"
        };
    }
  };

  const roleInfo = getRoleInfo();

  // Render role-specific dashboard content
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'parent':
        return (
          <ParentView 
            progressData={dashboardData.progress}
            diagnosticData={dashboardData.diagnostics}
            recommendationData={dashboardData.recommendations}
          />
        );
      case 'teacher':
        return (
          <TeacherView 
            progressData={dashboardData.progress}
            diagnosticData={dashboardData.diagnostics}
            recommendationData={dashboardData.recommendations}
          />
        );
      case 'admin':
        return (
          <AdminView 
            progressData={dashboardData.progress}
            diagnosticData={dashboardData.diagnostics}
            recommendationData={dashboardData.recommendations}
          />
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to DAWN AI Study</CardTitle>
              <CardDescription>Your personalized learning dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please contact your administrator to set up your role-specific dashboard.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                {roleInfo.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{roleInfo.title}</h1>
                <p className="text-gray-600">{roleInfo.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="capitalize">
                {userRole}
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {renderRoleSpecificContent()}
      </div>
    </div>
  );
}
