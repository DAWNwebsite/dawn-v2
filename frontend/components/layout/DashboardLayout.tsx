"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[250px] transform bg-background transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-background p-4 md:hidden">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
