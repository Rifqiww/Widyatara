"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ChevronRight, User, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to Nusantara map or home
      router.push("/Nusantara");
    } catch (err: any) {
      console.error(err);
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore, if not create record
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      router.push("/Nusantara");
    } catch (err: any) {
      console.error(err);
      setError("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F4E1]">
      {/* Gambar Kiri */}
      <div className="hidden lg:block relative overflow-hidden bg-[#543310]">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/auth-bg.png"
            alt="Cultural Background"
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[#543310]/40" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center text-[#F8F4E1]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-7xl font-black font-serif mb-6 tracking-wide text-[#FFD700] drop-shadow-sm">
              Widyatara
            </h1>
            <p className="text-xl max-w-md mx-auto leading-relaxed font-light italic tracking-wider opacity-90">
              "Menelusuri Jejak Peradaban, Merajut Masa Depan Bangsa"
            </p>
          </motion.div>
        </div>
      </div>

      {/* Login Form - Flat Design */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 bg-[#F8F4E1]">

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >

          <div className="mb-12">
            <h2 className="text-4xl font-black font-serif text-[#543310] mb-2 uppercase tracking-wide">Selamat Datang</h2>
            <p className="text-[#AF8F6F] font-medium tracking-wide">
              Masuk untuk melanjutkan petualangan budaya Anda.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#543310] uppercase tracking-widest ml-1">
                Email Pengguna
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#AF8F6F]/30 px-2 py-3 text-[#543310] placeholder-[#AF8F6F]/50 outline-none focus:border-[#543310] transition-colors duration-300 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-[#543310] uppercase tracking-widest">
                  Kata Sandi
                </label>
                <button type="button" className="text-xs text-[#AF8F6F] hover:text-[#543310] font-bold tracking-wide transition-colors">
                  LUPA KATA SANDI?
                </button>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#AF8F6F]/30 px-2 py-3 text-[#543310] placeholder-[#AF8F6F]/50 outline-none focus:border-[#543310] transition-colors duration-300 font-medium"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full bg-[#543310] text-[#F8F4E1] py-4 px-6 font-bold uppercase tracking-widest hover:bg-[#3E250B] transition-colors duration-300 flex items-center justify-between group disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-[#AF8F6F]/20 pt-8">
            <p className="text-[#74512D] text-sm">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-[#543310] font-black uppercase tracking-wider hover:underline ml-1"
              >
                Daftar Disini
              </Link>
            </p>
          </div>

          {/* login dengan lainnya */}
          <div className="mt-8 flex items-center gap-4 text-[#AF8F6F]/50">
            <div className="h-[1px] flex-1 bg-[#AF8F6F]/20" />
            <span className="text-xs uppercase tracking-widest font-bold">Atau Masuk Dengan</span>
            <div className="h-[1px] flex-1 bg-[#AF8F6F]/20" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 border border-[#AF8F6F]/30 rounded-full hover:bg-white/50 transition-all duration-300 text-sm font-bold text-[#543310] uppercase tracking-wide hover:shadow-sm"
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
              Google
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
