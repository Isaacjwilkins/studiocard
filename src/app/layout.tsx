import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import Background from "@/components/Background";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "studio.card | Share Your Practice Live",
  description: "The platform for students to record their practice, share it easily, and feel like a professional.",


  openGraph: {
    title: 'studio.card',
    description: 'Share Your Practice Live',
    siteName: 'studio.card',
    images: [
      {
        url: 'https://studiocard.live/aaw2.png', // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Background />
          <Navbar />
          <div className="relative z-10 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}