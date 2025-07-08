"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import AccessibilityPanel from "./accessibility/accessibility-panel";
import { Settings, Menu, X } from "lucide-react";
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

  return (
    <>
      <header className="bg-background sticky top-0 z-50 w-full border-b">
        <nav 
          className="container flex items-center justify-between h-16 px-4 md:px-6"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            className="flex items-center gap-2"
            href="/"
            aria-label="DAWN AI Study - Home"
          >
            <Image
              className=""
              src={process.env.NEXT_PUBLIC_DAWN_LOGO || "/images/logo.jpg"}
              alt="Dawn AI Study Logo"
              width={128}
              height={28}
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex items-center gap-4" role="menubar">
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href || ""}
                    className="text-sm font-medium hover:underline underline-offset-4"
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
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button
                className="bg-white text-[#620074] border-[#620074] border-2 rounded-full hover:text-white
                hover:transition-all hover:ease-in-out hover:duration-300 hover:delay-100 hover:bg-[#620074]
                focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                asChild
              >
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#620074] to-[#FF6A6A] rounded-full
                focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                asChild
              >
                <Link href="/auth/signup">Join For Free</Link>
              </Button>
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
          <div className="md:hidden" id="mobile-menu">
            <ul className="flex flex-col items-start gap-4 p-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href || ""}
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 px-8 py-4 border-t">
              <Button
                className="bg-white text-[#620074] border-[#620074] border-2 rounded-full
               hover:text-white hover:transition-all hover:duration-300 hover:delay-100 hover:bg-[#620074]
               focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
               asChild
              >
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#620074] to-[#FF6A6A] rounded-full
                focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                asChild
              >
                <Link href="/auth/signup">Join For Free</Link>
              </Button>
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
