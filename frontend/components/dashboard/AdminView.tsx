'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Database,
  CheckCircle,
  Clock,
  Brain,
  Settings,
  FileText,
  Download,
  Filter,
  Calendar,
  Activity,
  Target,
  Globe
} from 'lucide-react';

interface AdminViewProps {
  progressData: any[];
  diagnosticData: any[];
  recommendationData: any[];
}

export default function AdminView({ progressData, diagnosticData, recommendationData }: AdminViewProps) {
  
  const getPlatformMetrics = () => {
    // Calculate platform-wide statistics
    const totalUsers = 1247; // This would come from your user database
    const activeStudents = 892;
    const totalTeachers = 67;
    const totalParents = 743;
    
    return {
      totalUsers,
      activeStudents,
      totalTeachers,
      totalParents,
      averageEngagement: 78.5,
      platformUptime: 99.8
    };
  };

  const getComplianceMetrics = () => {
    return {
      coppaCompliance: 94.2,
      parentalConsents: 867,
      pendingConsents: 53,
      dataRetentionCompliance: 98.7,
      accessibilityCompliance: 96.1
    };
  };

  const getDiagnosticSummary = () => {
    return {
      totalAssessments: 1456,
      completedThisMonth: 123,
      pendingAssessments: 34,
      averageCompletionTime: 18.5, // minutes
      byType: {
        adhd: 456,
        dyslexia: 387,
        autism: 234,
        comprehensive: 379
      },
      interventionsRecommended: 289
    };
  };

  const getSystemAlerts = () => {
    return [
      {
        id: 1,
        type: 'compliance',
        severity: 'high',
        message: '15 parental consent forms will expire within 30 days',
        timestamp: '2024-06-26T14:30:00Z',
        action: 'Review & Renew'
      },
      {
        id: 2,
        type: 'performance',
        severity: 'medium',
        message: 'API response times elevated during peak hours',
        timestamp: '2024-06-26T10:15:00Z',
        action: 'Optimize'
      },
      {
        id: 3,
        type: 'security',
        severity: 'low',
        message: 'Routine security scan completed successfully',
        timestamp: '2024-06-26T02:00:00Z',
        action: 'View Report'
      }
    ];
  };

  const getResourceUtilization = () => {
    return {
      storageUsed: 67.8,
      bandwidthUsed: 43.2,
      apiCallsToday: 45678,
      concurrentUsers: 234,
      peakUsage: '2:30 PM - 3:30 PM'
    };
  };

  const platformMetrics = getPlatformMetrics();
  const complianceMetrics = getComplianceMetrics();
  const diagnosticSummary = getDiagnosticSummary();
  const systemAlerts = getSystemAlerts();
  const resourceUtilization = getResourceUtilization();

  return (
    <div className="space-y-6">
      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {platformMetrics.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {platformMetrics.activeStudents} students, {platformMetrics.totalTeachers} teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Platform Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {platformMetrics.averageEngagement}%
            </div>
            <p className="text-xs text-gray-500">Average weekly engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {diagnosticSummary.totalAssessments}
            </div>
            <p className="text-xs text-gray-500">
              {diagnosticSummary.completedThisMonth} completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complianceMetrics.coppaCompliance}%
            </div>
            <p className="text-xs text-gray-500">COPPA compliance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              System Alerts
            </CardTitle>
            <CardDescription>Critical system notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 pl-4 py-2 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={
                      alert.severity === 'high' ? 'destructive' :
                      alert.severity === 'medium' ? 'default' : 'secondary'
                    } className="text-xs">
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-gray-500 capitalize">
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Current system performance and usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span>{resourceUtilization.storageUsed}%</span>
                </div>
                <Progress value={resourceUtilization.storageUsed} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bandwidth Usage</span>
                  <span>{resourceUtilization.bandwidthUsed}%</span>
                </div>
                <Progress value={resourceUtilization.bandwidthUsed} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-lg">
                    {resourceUtilization.apiCallsToday.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">API Calls Today</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-lg">
                    {resourceUtilization.concurrentUsers}
                  </div>
                  <div className="text-xs text-gray-600">Active Users</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2">
                Peak usage: {resourceUtilization.peakUsage}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnostic Analytics & Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Diagnostic Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-500" />
              Diagnostic Analytics
            </CardTitle>
            <CardDescription>Assessment trends and intervention insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {diagnosticSummary.totalAssessments}
                </div>
                <div className="text-xs text-gray-600">Total Assessments</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {diagnosticSummary.interventionsRecommended}
                </div>
                <div className="text-xs text-gray-600">Interventions Needed</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Assessment Distribution</h4>
              {Object.entries(diagnosticSummary.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(count / diagnosticSummary.totalAssessments) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium">Average Completion Time</div>
              <div className="text-lg font-bold text-blue-600">
                {diagnosticSummary.averageCompletionTime} minutes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Compliance Overview
            </CardTitle>
            <CardDescription>COPPA compliance and data protection metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>COPPA Compliance Rate</span>
                  <span>{complianceMetrics.coppaCompliance}%</span>
                </div>
                <Progress value={complianceMetrics.coppaCompliance} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Data Retention Compliance</span>
                  <span>{complianceMetrics.dataRetentionCompliance}%</span>
                </div>
                <Progress value={complianceMetrics.dataRetentionCompliance} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accessibility Compliance</span>
                  <span>{complianceMetrics.accessibilityCompliance}%</span>
                </div>
                <Progress value={complianceMetrics.accessibilityCompliance} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-lg text-green-600">
                    {complianceMetrics.parentalConsents}
                  </div>
                  <div className="text-xs text-gray-600">Active Consents</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-lg text-yellow-600">
                    {complianceMetrics.pendingConsents}
                  </div>
                  <div className="text-xs text-gray-600">Pending Review</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Administrative Actions & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Administrative Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-500" />
              Administrative Actions
            </CardTitle>
            <CardDescription>Common platform management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Shield className="h-5 w-5" />
                <span className="text-xs">Review Compliance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Generate Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Database className="h-5 w-5" />
                <span className="text-xs">System Backup</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Globe className="h-5 w-5" />
                <span className="text-xs">Platform Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Audit Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Recent Reports
            </CardTitle>
            <CardDescription>Generated reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-sm">Weekly Platform Report</h4>
                    <p className="text-xs text-gray-600">June 20-26, 2024</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <h4 className="font-medium text-sm">Compliance Audit</h4>
                    <p className="text-xs text-gray-600">Monthly review</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-sm">Assessment Analytics</h4>
                    <p className="text-xs text-gray-600">Q2 2024 summary</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Button className="w-full" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance & Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Platform Growth & Performance
          </CardTitle>
          <CardDescription>Key performance indicators and growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {platformMetrics.platformUptime}%
              </div>
              <p className="text-sm text-gray-600 mb-2">System Uptime</p>
              <div className="text-xs text-green-600">↗ 99.9% target</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                +15%
              </div>
              <p className="text-sm text-gray-600 mb-2">User Growth</p>
              <div className="text-xs text-green-600">Month over month</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                23%
              </div>
              <p className="text-sm text-gray-600 mb-2">Interventions Success</p>
              <div className="text-xs text-purple-600">Improvement rate</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                4.8
              </div>
              <p className="text-sm text-gray-600 mb-2">User Satisfaction</p>
              <div className="text-xs text-orange-600">Out of 5.0</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
