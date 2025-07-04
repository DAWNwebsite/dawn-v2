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
      <div className="justify-center w-full mx-auto bg-background max-w-full">
        <nav 
          className="w-full h-[90px] flex justify-between items-center px-8 py-2 relative lg:px-12 md:px-3"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            className="text-base leading-normal hover:text-accent-500 font-medium flex items-center gap-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 rounded-lg"
            href="/"
            aria-label="DAWN AI Study - Home"
          >
            <Image
              className="dark:invert"
              src={process.env.NEXT_PUBLIC_DAWN_LOGO || "/images/logo.jpg"}
              alt="Dawn AI Study Logo"
              width={128}
              height={28}
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden space-x-8 lg:flex md:flex lg:space-x-8 md:space-x-5">
            <ul className="flex space-x-8 lg:space-x-8 md:space-x-2" role="menubar">
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href || ""}
                    className="text-base leading-normal hover:text-accent-500 font-normal 
                    hover:text-[#620074] hover:font-medium hover:transition-all hover:ease-in-out 
                    hover:duration-300 md:text-[12px] lg:text-base focus:outline-none focus:ring-2 
                    focus:ring-purple-600 focus:ring-offset-2 rounded-lg px-2 py-1"
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex md:flex items-center space-x-4">
            {/* Accessibility Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccessibilityOpen(true)}
              className="flex items-center space-x-1 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="sr-only">Accessibility</span>
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
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Accessibility Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccessibilityOpen(true)}
              className="flex items-center space-x-1 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              aria-label="Open accessibility settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 rounded-lg p-1"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <ul className="flex flex-col space-y-4 px-8 py-4" role="menu">
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href || ""}
                    className="text-base leading-normal hover:text-accent-500 font-normal hover:text-[#620074] 
                   hover:font-medium hover:transition-all hover:ease-in-out hover:duration-300 
                   focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 rounded-lg px-2 py-1 block"
                   role="menuitem"
                   onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 px-8 py-4">
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
      </div>
      
      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  );
}

export default Navbar;
