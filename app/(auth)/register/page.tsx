"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ChevronRight, Phone } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--background)] selection:bg-[var(--accent-gold)] selection:text-white">
      {/* gambar kiri */}
      <div className="hidden lg:block relative overflow-hidden bg-[var(--accent-dark)]">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/auth-bg.png"
            alt="Cultural Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-dark)] via-transparent to-transparent opacity-90" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-6xl font-serif text-[var(--background)] mb-6 tracking-wide">
              Mulai Petualangan
            </h1>
            <p className="text-white text-xl max-w-md mx-auto leading-relaxed font-light italic">
              "Jadilah bagian dari penjaga warisan agung Ibu Pertiwi."
            </p>
          </motion.div>
        </div>
      </div>

      {/* register form */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/auth-bg.png')] opacity-[0.03] lg:hidden" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md py-10"
        >
        
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-serif text-[var(--primary)] mb-3">Daftar Akun Baru</h2>
            <p className="text-[var(--secondary)] font-light">
              Lengkapi data diri untuk memulai perjalanan budaya Anda.
            </p>
          </div>

          {/* form */}
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--primary)] ml-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--accent)]" />
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Rifqi Kum"
                className="w-full bg-white/50 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-[var(--primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--primary)] ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                Email
              </label>
              <input
                type="email"
                placeholder="rifqikum@widyatara.com"
                className="w-full bg-white/50 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-[var(--primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--primary)] ml-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--accent)]" />
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/50 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-[var(--primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="pt-4 flex items-start space-x-2 ml-1">
              <input type="checkbox" id="terms" className="mt-1 accent-[var(--accent-gold)]" />
              <label htmlFor="terms" className="text-sm text-[var(--secondary)] leading-tight">
                Saya menyetujui <span className="text-[var(--accent-gold)] font-bold cursor-pointer hover:underline">Syarat & Ketentuan</span> yang berlaku.
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "var(--accent-earth)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[var(--primary)] text-[var(--background)] rounded-2xl py-4 font-semibold shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-2 mt-4"
            >
              Daftar Sekarang
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* footer */}
          <div className="mt-10 text-center">
            <p className="text-[var(--secondary)] text-sm">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="text-[var(--accent-gold)] font-bold hover:underline ml-1"
              >
                Masuk Disini
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
