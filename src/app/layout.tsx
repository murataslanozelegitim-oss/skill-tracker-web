import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from "@/components/service-worker-register";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Autism Observation App",
  description: "Application for teachers to collect data on pre-verbal communication skills in preschool students with autism",
  keywords: ["autism", "observation", "education", "preschool", "communication", "special education"],
  authors: [{ name: "Education Team" }],
  openGraph: {
    title: "Autism Observation App",
    description: "Application for teachers to collect data on pre-verbal communication skills",
    url: "https://example.com",
    siteName: "Autism Observation App",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autism Observation App",
    description: "Application for teachers to collect data on pre-verbal communication skills",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Autism Observation App",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
      <ServiceWorkerRegister />
      {children}
      <Toaster />
    </body>
    </html>
  );
}
