import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import Background from "@/components/Background"; // Import the background

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wilkinstudio | Creative Agency", // Change from "Isaac Wilkins"
  description: "We build digital experiences...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* 1. The Background sits at the bottom of the stack */}
          <Background /> 
          
          <Navbar />

          {/* 2. All content, including the footer, sits on this z-index layer */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            
            {/* 3. Footer is now safely layered and centered */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}