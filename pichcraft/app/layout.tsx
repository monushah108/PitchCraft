import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PitchCraft AI — AI-Powered Email Outreach for Job Seekers",
  description:
    "Generate hyper-personalized, high-converting outreach emails to recruiters and hiring managers. Inspired by Linear, Stripe, and Resend.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-indigo-500/15 selection:text-indigo-900`}
    >
      <body className="min-h-full flex flex-col bg-[#FBFBFC] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
