import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaShare — Share & Discover",
  description: "A clean, minimal media sharing platform powered by AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-14">
            {children}
          </main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
