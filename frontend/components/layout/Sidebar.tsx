'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Search, 
  User, 
  Settings, 
  GraduationCap,
  MessageSquare,
  BarChart3,
  HelpCircle
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    name: "Knowledge Base",
    href: "/dashboard/knowledge-base",
    icon: Search,
    description: "AI-powered educational resources"
  },
  {
    name: "Assessments",
    href: "/dashboard/assessments",
    icon: BarChart3,
    description: "Diagnostic and learning assessments"
  },
  {
    name: "Learning Modules",
    href: "/dashboard/learning",
    icon: GraduationCap,
    description: "Adaptive learning content"
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    description: "Communication center"
  },
  {
    name: "AIDA",
    href: "/dashboard/aida",
    icon: MessageSquare,
    description: "AI-powered diagnostic assistant"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Profile and accessibility preferences"
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">DAWN AI</h2>
            <p className="text-xs text-gray-500">Learning Platform</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {session.user.role || 'student'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                isActive 
                  ? "bg-purple-100 text-purple-700 border border-purple-200" 
                  : "text-gray-700 hover:text-gray-900"
              )}
              title={item.description}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-purple-600" : "text-gray-400"
              )} />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/help"
          onClick={onClose}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <span>Help & Support</span>
        </Link>
      </div>
    </aside>
  );
}
