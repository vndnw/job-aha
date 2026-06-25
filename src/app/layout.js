import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BlurProvider from "@/components/BlurProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "A-Careers Job Dashboard & Applicant Tracker",
  description: "Dashboard for viewing job postings and application statuses crawled from CMS.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BlurProvider />
        {children}
      </body>
    </html>
  );
}

