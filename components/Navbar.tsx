"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Home, Compass, LogIn, LogOut, User } from "lucide-react";
import { useTransitionContext } from "./TransitionContext";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  {
    name: "Beranda",
    link: "/",
  },
  {
    name: "Nusantara",
    link: "/Nusantara",
  },
];

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Auth & User State
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserName(userDoc.data().name);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        setUserName("");
      }
    };

    fetchUserName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Desktop background logic
      setScrolled(currentScrollY > 20);

      // Mobile hide/show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scroll Down -> Hide
      } else {
        setIsVisible(true); // Scroll Up -> Show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const { triggerTransition } = useTransitionContext();

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    if (link === "/Nusantara") {
      e.preventDefault();
      triggerTransition(link);
    }
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="fixed top-3 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`pointer-events-auto relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-500 ${scrolled
            ? "bg-white border border-gray-100 shadow-xl ring-1 ring-black/5"
            : "bg-white/95 backdrop-blur-md border border-white/20 shadow-lg ring-1 ring-white/20"
            }`}
        >
          {/* Logo Section */}
          <Link href="/">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center bg-white w-[70px] h-[70px] rounded-xl shadow-inner border border-[#AF8F6F]/10 overflow-hidden cursor-pointer"
            >
              <Image
                src="/assets/widyatara-logo.png"
                alt="Widyatara Logo"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Divider between Logo and Nav */}
          <motion.div
            variants={itemVariants}
            className="h-8 w-px bg-[#AF8F6F]/30 mx-1"
          />

          {/* Navigation Items */}
          <div className="flex items-center gap-1 text-bold">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.link}
                  onClick={(e) => handleLinkClick(e, item.link)}
                  className={`
                    relative z-10 px-5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors duration-300
                    flex items-center gap-1.5 cursor-pointer
                    ${pathname === item.link
                      ? "text-[#F8F4E1]"
                      : "text-[#543310]/80 hover:text-[#543310]"
                    }
                  `}
                >
                  {item.name}
                </Link>

                {/* Shared Layout Hover Background */}
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div
                      layoutId="navHover"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-[#543310]/5 rounded-xl z-0"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Active Background */}
                {pathname === item.link && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute inset-0 bg-[#543310] rounded-xl z-0 shadow-md shadow-[#543310]/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Divider between Nav and Login */}
          <motion.div
            variants={itemVariants}
            className="h-8 w-px bg-[#AF8F6F]/30 mx-1"
          />

          {/* Login/User Button */}
          <motion.div variants={itemVariants}>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-[#543310] font-bold text-sm hidden lg:block">
                  Hi, {userName || "Pengguna"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#543310] text-[#F8F4E1] shadow-md hover:bg-[#3d250c] transition-colors"
                  title="Keluar"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px -10px rgba(84,51,16,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-7 py-2.5 rounded-xl bg-[#543310] text-[#F8F4E1] text-sm font-extrabold shadow-[0_4px_12px_rgba(84,51,16,0.2)] hover:bg-[#3d250c] transition-all cursor-pointer"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </nav>

      {/* --- MOBILE MODERNISED NAVBAR (Liquid Dock) --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
        <motion.div
          className="relative bg-[#F8F4E1]/80 backdrop-blur-3xl border border-[#AF8F6F]/20 shadow-[0_20px_50px_rgba(84,51,16,0.2)] rounded-xl px-3 py-2 flex items-center justify-around"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{
            y: isVisible ? 0 : 200, // Slide down if not visible
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.8,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
          }}
        >
          {[
            { name: "Beranda", link: "/", icon: Home },
            { name: "Nusantara", link: "/Nusantara", icon: Compass },
            user
              ? { name: userName?.split(" ")[0] || "Akun", action: handleLogout, icon: User, isAction: true }
              : { name: "Login", link: "/login", icon: LogIn },
          ].map((item: any) => {
            const isActive = !item.isAction && item.link === pathname;
            const Icon = item.icon;

            const Wrapper: any = item.isAction ? "button" : Link;
            const props = item.isAction
              ? { onClick: item.action }
              : { href: item.link || "#", onClick: (e: any) => handleLinkClick(e, item.link!) };

            return (
              <Wrapper
                key={item.name}
                {...props}
                className="flex-1 flex justify-center w-full"
              >
                <motion.div
                  className={`relative flex flex-col items-center gap-1 p-4 rounded-xl transition-colors duration-500 ${isActive ? "text-[#F8F4E1]" : "text-[#543310]/60"
                    }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Background Liquid Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActive"
                      className="absolute inset-0 bg-[#543310] rounded-xl -z-10 shadow-[0_8px_20px_rgba(84,51,16,0.3)]"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <motion.div
                    animate={
                      isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-70"
                        }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                </motion.div>
              </Wrapper>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
};

export default Navbar;
