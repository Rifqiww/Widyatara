import React from "react";

export const ResultScreen = ({
  type,
  score,
  maxCombo,
  accuracy,
  onRestart,
  onExit,
}: {
  type: "WIN" | "LOSE";
  score: number;
  maxCombo: number;
  accuracy: number;
  onRestart: () => void;
  onExit: () => void;
}) => (
  <div
    className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-auto backdrop-blur-md"
    style={{ zIndex: 60 }}
  >
    <h2
      className={`text-5xl font-serif flex items-center justify-center font-bold mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.7)] text-center w-full ${type === "WIN" ? "text-[#d4af37]" : "text-red-500"}`}
    >
      {type === "WIN" ? "TEMBANG SELESAI" : "GAME OVER"}
    </h2>
    <div
      className={`text-sm mb-8 uppercase tracking-widest ${type === "WIN" ? "text-green-400" : "text-red-300"}`}
    >
      {type === "WIN" ? "Kamu Berhasil" : "Harmoni Terputus"}
    </div>

    {type === "LOSE" && (
      <p className="text-gray-300 mb-8 italic text-lg">
        "Kegagalan adalah awal dari kebangkitan..."
      </p>
    )}

    {type === "WIN" && (
      <div className="bg-primary p-10 rounded-lg border border-[#d4af37] text-center min-w-[350px] shadow-2xl mb-8">
        <div className="text-white text-xl uppercase mb-1">Skor Akhir</div>
        <div className="text-5xl font-bold text-white mb-6 font-plus-jakarta">
          {score}
        </div>

        <div className="grid grid-cols-2 gap-4 text-left border-t border-accent-gold pt-4">
          <div>
            <div className="text-white text-xs">Max Combo</div>
            <div className="text-xl font-bold text-[#ffd700] font-plus-jakarta">{maxCombo}</div>
          </div>
          <div>
            <div className="text-white text-xs">Accuracy</div>
            <div className="text-xl font-bold text-green-400 font-plus-jakarta">{accuracy}%</div>
          </div>
        </div>
      </div>
    )}

    <div className="flex gap-4 font-plus-jakarta">
      <button
        onClick={onRestart}
        className={`px-8 py-3 rounded border font-bold transition shadow-lg cursor-pointer ${
          type === "WIN"
            ? "bg-[#1a4020] hover:bg-[#2a6030] text-green-100 border-green-700"
            : "bg-[#5c1010] hover:bg-[#7c1515] text-red-100 border-red-700"
        }`}
      >
        {type === "WIN" ? "MAIN LAGI" : "COBA LAGI"}
      </button>

      <button
        onClick={onExit}
        className="px-8 py-3 cursor-pointer bg-accent-earth hover:bg-accent-earth/80 text-gray-200 rounded border border-gray-600 font-bold transition shadow-lg"
      >
        KELUAR
      </button>
    </div>
  </div>
);
