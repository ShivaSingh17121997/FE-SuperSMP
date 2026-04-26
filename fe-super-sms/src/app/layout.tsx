import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/provider";
import DbInitializer from "@/components/common/DbInitializer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SuperSMP — School Management Platform",
    template: "%s | SuperSMP",
  },
  description: "The all-in-one school management platform trusted by 500+ schools. Manage students, teachers, attendance, fees, exams, and more — all in one smart platform.",
  keywords: ["school management", "school ERP", "student management", "school software", "education technology", "SaaS", "attendance tracking", "fee management"],
  authors: [{ name: "SuperSMP" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://supersmp.com",
    siteName: "SuperSMP",
    title: "SuperSMP — Manage Your Entire School in One Smart Platform",
    description: "The all-in-one school management platform trusted by 500+ schools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperSMP — School Management Platform",
    description: "The all-in-one school management platform trusted by 500+ schools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <StoreProvider>
          <DbInitializer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
