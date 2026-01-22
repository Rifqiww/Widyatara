"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  MapPin, 
  Edit2, 
  LogOut, 
  ChevronRight,
  Star,
  Award,
  ArrowLeft
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  completedGames?: string[];
  totalScore?: number;
  achievements?: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Fallback to auth data if Firestore doc doesn't exist
            setUserData({
              uid: user.uid,
              name: user.displayName || "Penjelajah Nusantara",
              email: user.email || "",
              createdAt: user.metadata.creationTime || new Date().toISOString(),
              completedGames: [],
              totalScore: 0,
              achievements: []
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#543310] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const joinDate = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Tidak diketahui";

  const completedGamesCount = userData?.completedGames?.length || 0;
  const totalScore = userData?.totalScore || 0;
  const achievementsCount = userData?.achievements?.length || 0;

  return (
    <div className="min-h-screen bg-[#F8F4E1] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#AF8F6F]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#543310]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#543310] hover:text-[#74512D] transition-colors mb-4 font-bold uppercase tracking-wider text-sm"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-[#543310] uppercase tracking-wide">
            Profil Saya
          </h1>
          <p className="text-[#AF8F6F] font-medium mt-2">
            Perjalanan Anda menjelajahi kekayaan budaya Nusantara
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Profile Card with Mascot */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border-4 border-[#543310] p-6 md:p-8 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#543310] opacity-10 transform rotate-45 translate-x-10 -translate-y-10" />
              
              {/* Mascot Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/20 to-[#9F1239]/20 rounded-full blur-2xl" />
                <img
                  src="/hero-mascot.png"
                  alt="Widyatara Mascot"
                  className="w-full max-w-[250px] mx-auto relative z-10 drop-shadow-2xl"
                />
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-4 right-4 z-20"
                >
                </motion.div>
              </motion.div>

              {/* User Info */}
              <div className="text-center space-y-3 relative z-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#543310] uppercase tracking-wide">
                  {userData?.name}
                </h2>
                <p className="text-[#AF8F6F] font-medium flex items-center justify-center gap-2">
                  <Mail size={16} />
                  {userData?.email}
                </p>
                <p className="text-[#74512D] text-sm flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Bergabung {joinDate}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#543310] text-[#F8F4E1] py-3 px-4 font-bold uppercase tracking-wider hover:bg-[#3E250B] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Profil
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full border-2 border-[#543310] text-[#543310] py-3 px-4 font-bold uppercase tracking-wider hover:bg-[#543310] hover:text-[#F8F4E1] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Keluar
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid sm:grid-cols-3 gap-4"
            >
              <StatCard
                icon={<Trophy className="w-8 h-8" />}
                value={completedGamesCount}
                label="Game Selesai"
                color="from-[#D97706] to-[#78350F]"
                delay={0.1}
              />
              <StatCard
                icon={<Star className="w-8 h-8" />}
                value={totalScore}
                label="Total Skor"
                color="from-[#9F1239] to-[#543310]"
                delay={0.1}
              />
              <StatCard
                icon={<Award className="w-8 h-8" />}
                value={achievementsCount}
                label="Pencapaian"
                color="from-[#543310] to-[#74512D]"
                delay={0.1}
              />
            </motion.div>
            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white border-4 border-[#543310] p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#543310] p-3">
                  <MapPin className="w-6 h-6 text-[#F8F4E1]" />
                </div>
                <h3 className="text-2xl font-black text-[#543310] uppercase tracking-wide">
                  Penjelajahan Pulau
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Sumatera", progress: 0, total: 2 },
                  { name: "Jawa", progress: 0, total: 3 },
                  { name: "Kalimantan", progress: 0, total: 3 },
                  { name: "Sulawesi", progress: 0, total: 2 },
                  { name: "Papua", progress: 0, total: 2 }
                ].map((island, index) => (
                  <motion.div
                    key={island.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#543310] uppercase tracking-wide text-sm">
                        {island.name}
                      </span>
                      <span className="text-[#AF8F6F] font-medium text-sm">
                        {island.progress}/{island.total} Game
                      </span>
                    </div>
                    <div className="h-3 bg-[#F8F4E1] border-2 border-[#AF8F6F]/30 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(island.progress / island.total) * 100}%` }}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#543310] to-[#D97706]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  delay: number;
}

function StatCard({ icon, value, label, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white border-4 border-[#543310] p-6 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative z-10">
        <div className="text-[#543310] mb-3">
          {icon}
        </div>
        <div className="text-3xl md:text-4xl font-black text-[#543310] mb-1">
          {value}
        </div>
        <div className="text-[#AF8F6F] font-bold uppercase tracking-wider text-xs">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
