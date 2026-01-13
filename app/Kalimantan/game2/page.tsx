import DayakMemoryGame from "./components/DayakMemoryGame";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function DayakGamePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F4E1] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-20 px-4">
        <div className="mb-12 text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 mt-6">
            Patung Dayak
          </h1>
          <p className="text-secondary text-lg">
            Ikuti jejak leluhur melalui alunan simbol ukiran Dayak. 
            Ketajaman mata dan keheningan hati adalah kunci penguasaan totem.
          </p>
        </div>
        <DayakMemoryGame />
      </div>

      <Footer />
    </main>
  );
}
