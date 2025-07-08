'use client';

import { useSession } from 'next-auth/react';
import { Schedule } from '@/components/dashboard/unified/Schedule';
import { UpcomingDeadlines } from '@/components/dashboard/unified/UpcomingDeadlines';
import { TrendingCourses } from '@/components/dashboard/unified/TrendingCourses';
import { NewCourses } from '@/components/dashboard/unified/NewCourses';
import { MyCourses } from '@/components/dashboard/unified/MyCourses';
import { Notifications } from '@/components/dashboard/unified/Notifications';
import { Attendance } from '@/components/dashboard/unified/Attendance';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Welcome Back, {session?.user?.name || 'User'}!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your learning journey.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <MyCourses />
          <div className="grid gap-6 md:grid-cols-2">
            <TrendingCourses />
            <NewCourses />
          </div>
        </div>

        {/* Right Sidebar Area (1 column) */}
        <div className="space-y-6">
          <UpcomingDeadlines />
          <Notifications />
        </div>
      </div>

      {/* Full-width components */}
      <div className="grid gap-6">
        <Schedule />
        <Attendance />
      </div>
    </div>
  );
}
