"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ChevronRight, Phone, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      // Redirect to login or home
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
      setError("Gagal daftar dengan Google. Silakan coba lagi.");
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

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Logo/Title */}
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-[#F8F4E1] uppercase tracking-wider font-serif">
                Widyatara
              </h1>
              <div className="w-32 h-1 bg-[#D97706] mx-auto" />
            </div>

            {/* Tagline */}
            <p className="text-2xl text-[#F8F4E1] font-medium max-w-md mx-auto leading-relaxed">
              Jelajahi Kekayaan Budaya Nusantara
            </p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 space-y-4 text-background"
            >
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                <span className="text-sm font-medium tracking-wide">Permainan Interaktif</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                <span className="text-sm font-medium tracking-wide">Pelajari Tradisi Lokal</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 bg-[#D97706] rounded-full" />
                <span className="text-sm font-medium tracking-wide">Raih Pencapaian</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Register Form - Flat Design */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 bg-[#F8F4E1] overflow-y-auto">

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md py-10"
        >

          <div className="mb-12">
            <h2 className="text-4xl font-black font-serif text-[#543310] mb-2 uppercase tracking-wide">Buat Akun</h2>
            <p className="text-[#AF8F6F] font-medium tracking-wide">
              Bergabunglah untuk menjelajahi kekayaan Nusantara.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-8" onSubmit={handleRegister}>
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#543310] uppercase tracking-widest ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#AF8F6F]/30 px-2 py-3 text-[#543310] placeholder-[#AF8F6F]/50 outline-none focus:border-[#543310] transition-colors duration-300 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#543310] uppercase tracking-widest ml-1">
                Email
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
              <label className="text-xs font-bold text-[#543310] uppercase tracking-widest ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#AF8F6F]/30 px-2 py-3 text-[#543310] placeholder-[#AF8F6F]/50 outline-none focus:border-[#543310] transition-colors duration-300 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex items-start space-x-3 ml-1">
              <input type="checkbox" id="terms" className="mt-1 accent-[#543310] w-4 h-4 cursor-pointer" required />
              <label htmlFor="terms" className="text-sm text-[#AF8F6F] font-medium leading-tight">
                Saya menyetujui <span className="text-[#543310] font-bold cursor-pointer hover:underline">Syarat & Ketentuan</span> yang berlaku.
              </label>
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
                  <span>Daftar Sekarang</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* login dengan lainnya */}
          <div className="mt-8 flex items-center gap-4 text-[#AF8F6F]/50">
            <div className="h-[1px] flex-1 bg-[#AF8F6F]/20" />
            <span className="text-xs uppercase tracking-widest font-bold">Atau Daftar Dengan</span>
            <div className="h-[1px] flex-1 bg-[#AF8F6F]/20" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleRegister}
              className="flex items-center justify-center gap-2 py-3 border border-[#AF8F6F]/30 rounded-full hover:bg-white/50 transition-all duration-300 text-sm font-bold text-[#543310] uppercase tracking-wide hover:shadow-sm"
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
              Google
            </button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-[#AF8F6F]/20 pt-8">
            <p className="text-[#74512D] text-sm">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="text-[#543310] font-black uppercase tracking-wider hover:underline ml-1"
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
