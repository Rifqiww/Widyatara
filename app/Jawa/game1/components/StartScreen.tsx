import React from "react";

export const StartScreen = ({
  onStart,
  hidden,
}: {
  onStart: () => void;
  hidden: boolean;
}) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-accent-dark/90 backdrop-blur-sm transition-opacity duration-1000 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      style={{ zIndex: 50 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-(--color-primary)/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-(--color-primary)/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-3xl animate-[pulse_4s_infinite]" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center transition-all duration-500 ${hidden ? "scale-90 opacity-0 blur-sm invisible" : "scale-100 opacity-100 blur-0 visible"}`}
      >
        <div className="animate-[float-wayang_6s_infinite_ease-in-out]">
          <img
            src="/Jawa/game1/gamelan-logo.png"
            alt="Gamelan Saron Logo"
            width={300}
            height={300}
            className="drop-shadow-[0_0_25px_rgba(217,119,6,0.4)]"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-accent-gold mb-3 tracking-widest drop-shadow-[0_0_15px_rgba(217,119,6,0.6)] font-plus-jakarta uppercase">
          Gamelan Saron
        </h1>

        <h2 className="text-xl md:text-2xl text-accent mb-10 font-plus-jakarta tracking-wide">
          Ketuk Gamelan Sesuai Dengan Alunan Musik
        </h2>

        <button
          onClick={onStart}
          className="cursor-pointer group relative px-12 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-linear-to-r from-secondary to-accent-earth opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border-2 border-accent-gold rounded-full opacity-50 group-hover:opacity-100 blur-[1px] group-hover:blur-0 transition-all" />
          <span className="relative text-background font-bold text-xl md:text-2xl tracking-widest uppercase font-plus-jakarta flex items-center gap-3">
            Mulai
            <span className="text-accent-gold group-hover:translate-x-1 transition-transform">
              ▶
            </span>
          </span>
        </button>

        <div className="mt-12 space-y-3 text-accent/80 font-plus-jakarta">
          <div className="hidden md:block">
            <p className="text-sm uppercase tracking-widest mb-2 opacity-70">
              Kontrol Keyboard
            </p>
            <div className="flex gap-2 justify-center">
              {["A", "S", "D", "F", "G"].map((key) => (
                <span
                  key={key}
                  className="w-8 h-8 flex items-center justify-center rounded bg-background/10 border border-accent-gold/50 text-accent-gold font-bold font-mono"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
