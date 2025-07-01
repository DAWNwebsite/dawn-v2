"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react"; // You can swap with any menu icon

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-4 absolute top-0 left-0 z-50"
      >
        <Menu />
      </button>

      {/* Overlay + Sidebar for mobile */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed z-50 md:relative transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4">{children}</main>
    </div>
  );
}
