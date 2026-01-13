"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ChevronRight, User } from "lucide-react";

export default function LoginPage() {
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
              Widyatara
            </h1>
            <p className="text-white text-xl max-w-md mx-auto leading-relaxed font-light italic">
              "Menelusuri Jejak Peradaban, Merajut Masa Depan Bangsa"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center space-x-8"
          >
            <div className="w-16 h-[1px] bg-[var(--accent)]" />
            <div className="w-16 h-[1px] bg-[var(--accent)]" />
          </motion.div>
        </div>
      </div>

      {/* login form */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/auth-bg.png')] opacity-[0.03] lg:hidden" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
  
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-serif text-[var(--primary)] mb-3">Selamat Datang Kembali</h2>
            <p className="text-[var(--secondary)] font-light">
              Lanjutkan perjalanan mengenal budaya Nusantara bersama kami.
            </p>
          </div>

          {/* form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--primary)] ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                Email Pengguna
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="rifqikum@example.com"
                  className="w-full bg-white/50 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-[var(--primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-[var(--primary)] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--accent)]" />
                  Kata Sandi
                </label>
                <button type="button" className="text-xs text-[var(--accent-gold)] hover:underline font-medium">
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-[var(--primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-1">
              <input type="checkbox" id="remember" className="accent-[var(--accent-gold)]" />
              <label htmlFor="remember" className="text-sm text-[var(--secondary)]">
                Ingat saya di perangkat ini
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "var(--accent-earth)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[var(--primary)] text-[var(--background)] rounded-2xl py-4 font-semibold shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-2 transition-colors duration-300"
            >
              Masuk Sekarang
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-[var(--secondary)] text-sm">
              Belum bergabung dengan Widyatara?{" "}
              <Link
                href="/register"
                className="text-[var(--accent-gold)] font-bold hover:underline ml-1"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>

          {/* login dengan lainnya */}
          <div className="mt-10 flex items-center gap-4 text-[var(--accent)]/50">
            <div className="h-[1px] flex-1 bg-[var(--accent)]/20" />
            <span className="text-xs uppercase tracking-widest font-bold">Atau Masuk Dengan</span>
            <div className="h-[1px] flex-1 bg-[var(--accent)]/20" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-[var(--accent)]/30 rounded-xl hover:bg-white transition-all duration-300 text-sm font-medium text-[var(--primary)]">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Google
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
