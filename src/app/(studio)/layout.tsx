// src/app/studio/layout.tsx
import StudioNavbar from "@/components/StudioNavbar"; // 👈 CORRECT IMPORT
import Footer from "@/components/footer"; 

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioNavbar />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow bg-zinc-50 dark:bg-black">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}