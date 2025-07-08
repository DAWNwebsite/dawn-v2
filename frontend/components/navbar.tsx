"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import AccessibilityPanel from "./accessibility/accessibility-panel";
import { Settings, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useTheme } from "./providers/theme-provider";

const navigation = [
  {
    name: "For Students",
    href: "/students",
  },
  {
    name: "For Educators",
    href: "/educators",
  },
  {
    name: "Assessments",
    href: "/assessments",
  },
  {
    name: "AI Powered Learning",
    href: "/ai-learning",
  },
  {
    name: "AI Spaces",
    href: "/ai-spaces",
  },
  {
    name: "Remote Jobs",
    href: "/remote-jobs",
  },
  {
    name: "Accessibility",
    href: "/accessibility-demo",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const { theme } = useTheme();
  const { data: session } = useSession();

  return (
    <>
      <header className="bg-white sticky top-0 z-50 w-full border-b border-gray-200">
        <nav 
          className="container flex items-center justify-between h-20 px-4 md:px-6"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            aria-label="DAWN AI Study - Home"
          >
            <Image
              src={process.env.NEXT_PUBLIC_DAWN_LOGO || "/images/logo.jpg"}
              alt="Dawn AI Study Logo"
              width={100}
              height={28}
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6" role="menubar">
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors"
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAccessibilityOpen(true)}
                aria-label="Open accessibility settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <UserCircle className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-full border-purple-700 text-purple-700 hover:bg-purple-50 hover:text-purple-700 px-6"
                    asChild
                  >
                    <Link href="/auth/signin">Login</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-6"
                    asChild
                  >
                    <Link href="/auth/signup">Join For Free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAccessibilityOpen(true)}
              className="mr-2"
              aria-label="Open accessibility settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
        
        {menuOpen && (
          <div className="md:hidden bg-white" id="mobile-menu">
            <ul className="flex flex-col items-start gap-4 p-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block w-full text-left text-gray-700 hover:bg-gray-100 p-2 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-2 p-4 border-t">
              {session ? (
                <>
                  <Link href="/dashboard" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <UserCircle className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/signin">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Join For Free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      <AccessibilityPanel
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  );
}

export default Navbar;
