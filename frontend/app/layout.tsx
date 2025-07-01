import "./globals.css";
import "./accessibility.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_URL}`),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: "DAWN AI",
    url: `${process.env.NEXT_PUBLIC_URL}`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAFAFA]`}
      >
        <ThemeProvider defaultTheme="light" storageKey="dawn-theme">
          <Providers>
            {/* Skip to main content link for screen readers */}
            <a href="#main-content" className="skip-link sr-only-focusable">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content">
              {children}
            </main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
