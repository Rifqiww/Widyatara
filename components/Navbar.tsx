"use client";
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {Instagram, X, Facebook} from "lucide-react";

const navItems = [
  { name: "Tari", full: "Tari Tradisional" },
  { name: "Rumah", full: "Rumah Adat Tradisional" },
  { name: "Musik", full: "Alat Musik Tradisional" },
];

export default function Navbar() {
  return (
    <>
      {/* Desktop */}
      <nav className="fixed top-6 left-0 right-0 z-[60] hidden md:flex justify-center px-4 pointer-events-none">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#F8F4E1]/80 backdrop-blur-lg border border-[#AF8F6F]/20 px-8 py-4 rounded-full flex items-center gap-2 shadow-xl pointer-events-auto"
        >
          {navItems.map((item, index) => {
            const [isHovered, setIsHovered] = React.useState(false);
            
            return (
              <motion.button
                layout
                key={item.full}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  duration: 0.3
                }}
                className="relative flex items-center justify-center px-6 py-2 text-foreground text-sm font-semibold tracking-widest uppercase cursor-pointer group rounded-full"
              >
                {/* hover effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#AF8F6F]/10 to-[#543310]/10 rounded-full duration-1000"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative overflow-hidden flex items-center justify-center min-h-[1.5rem] duration-1000">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={isHovered ? 'full' : 'short'}
                      initial={{ x: isHovered ? 40 : -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: isHovered ? -40 : 40, opacity: 0 }}
                      transition={{ 
                        duration: 1, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="inline-block whitespace-nowrap"
                    >
                      {isHovered ? item.full : item.name}
                    </motion.span>
                  </AnimatePresence>
                </div>
              
                {/* Underline Decoration */}
                <motion.div
                  className="absolute bottom-1 left-1/2 h-[2px] bg-[#AF8F6F] rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  animate={{ width: isHovered ? "60%" : 0, x: "-50%" }}
                  transition={{ duration: 0.4 }}
                />

                {/* Accent Dot */}
                <motion.div
                  className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#AF8F6F] rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: isHovered ? 1 : 0 }}
                  transition={{ delay: 0.1 }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-6 left-4 right-4 z-[60] md:hidden flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#543310]/95 backdrop-blur-xl border border-[#AF8F6F]/30 w-full max-w-[400px] px-2 py-4 rounded-3xl flex justify-around items-center shadow-2xl pointer-events-auto"
        >
          {navItems.map((item) => (
            <button
              key={item.full}
              className="flex flex-col items-center gap-1 text-[#F8F4E1] transition-transform active:scale-90"
            >
              <span className="text-[10px] font-bold tracking-tighter uppercase font-serif">
                {item.name}
              </span>
              <div className="w-1 h-1 rounded-full bg-[#AF8F6F]" />
            </button>
          ))}
        </motion.div>
      </nav>
    </>
  );
}
