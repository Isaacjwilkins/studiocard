import Navbar from "@/components/Navbar";
import Footer from "@/components/footer"; // Note: Check case sensitivity (Footer vs footer) based on your file name
import Background from "@/components/Background";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Background />
      <Navbar />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}