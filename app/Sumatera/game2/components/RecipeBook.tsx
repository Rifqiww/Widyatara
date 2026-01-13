"use client"
import React from "react";
import { BookOpen, UtensilsCrossed, ScrollText, ChefHat, Lightbulb } from "lucide-react";

const RecipeBook: React.FC = () => {
  return (
    <div className="bg-white/60 rounded-[2.5rem] border border-white p-6 md:p-8 shadow-inner overflow-hidden relative">
      <h3 className="text-2xl font-black text-[color:var(--text-primary)] flex items-center gap-3 mb-6">
        <UtensilsCrossed className="w-6 h-6 text-[color:var(--accent)]" />
        Resep Warisan
      </h3>

      <div className="space-y-8">
        {/* bahan */}
        <section className="space-y-4">
          <h4 className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-[color:var(--accent-strong)]">
            <ScrollText className="w-4 h-4" /> Bahan-Bahan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-bold text-sm">Bahan Utama:</p>
              <ul className="text-sm space-y-1 text-[color:var(--text-primary)]/80 list-disc pl-4">
                <li>1 kg Daging sapi (Bagian paha/sengkel)</li>
                <li>2.5 liter Santan kental (3-4 kelapa tua)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm">Bumbu Halus:</p>
              <ul className="text-sm grid grid-cols-2 gap-x-2 text-[color:var(--text-primary)]/80 list-disc pl-4">
                <li>Bawang merah (100g)</li>
                <li>Bawang putih (50g)</li>
                <li>Cabai merah keriting (150g)</li>
                <li>Jahe & Lengkuas</li>
                <li>Kunyit bakar</li>
                <li>Garam</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-[color:var(--bg-primary)]/30 rounded-2xl">
            <p className="font-bold text-sm mb-2">Bumbu Cemplung (Rempah Daun):</p>
            <p className="text-sm text-[color:var(--text-primary)]/80 italic">
              Serai (memarkan), Daun jeruk, Daun salam, Daun kunyit (ikat simpul), & Rempah kering (Bunga lawang, kapulaga, cengkeh).
            </p>
          </div>
        </section>

        {/* process stepbystep */}
        <section className="space-y-6">
          <h4 className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-[color:var(--accent-strong)]">
            <ChefHat className="w-4 h-4" /> Step-by-Step (Proses Budaya)
          </h4>
          <div className="space-y-6">
            {[
              { step: "1. Persiapan Awal (The Mix)", text: "Campur santan kental dengan bumbu halus and rempah daun di kuali besar. Aduk terus agar santan tidak pecah.", hint: "Tips: Di tahap ini, aroma mulai keluar." },
              { step: "2. Tahap Gulai (The Boil)", text: "Masukkan potongan daging sapi saat santan mendidih and mulai berminyak. Kecilkan api.", hint: "Status: Kuah masih oranye terang and encer." },
              { step: "3. Tahap Kalio (The Reduction)", text: "Masak terus hingga kuah menyusut, mengental, and mengeluarkan banyak minyak.", hint: "Status: Berwarna cokelat kemerahan (Kalio)." },
              { step: "4. Tahap Rendang (The Slow Cook)", text: "Tahap paling krusial! Gunakan api paling kecil (low heat). Masak hingga bumbu menempel kering pada daging.", hint: "Status: Inilah hasil akhir 'Dedak Rendang' yang autentik." }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-[color:var(--accent)]/20">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[color:var(--accent)]" />
                <p className="font-bold text-sm mb-1">{item.step}</p>
                <p className="text-sm text-[color:var(--text-primary)]/80 mb-2">{item.text}</p>
                <p className="text-[10px] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)] py-1 px-3 rounded-full inline-block font-bold mb-1">
                  {item.hint}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts */}
        <section className="p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl border-2 border-orange-200">
          <h4 className="flex items-center gap-2 font-black text-orange-900 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-500" /> Tahukah Anda?
          </h4>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="text-2xl">🌍</span>
              <p className="text-sm text-orange-900/80 font-medium leading-relaxed">
                <strong>Warisan Dunia:</strong> Rendang dinobatkan sebagai makanan terenak di dunia versi CNN Travel selama bertahun-tahun.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RecipeBook;
