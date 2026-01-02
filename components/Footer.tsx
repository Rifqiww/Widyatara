"use client";

import { motion } from "framer-motion";
import {Instagram, X, Facebook} from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Tentang", href: "#" },
    { title: "Koleksi", href: "#" },
    { title: "Kontak", href: "#" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: <Instagram/>, href: "#" },
    { name: "Twitter", icon: <X/>, href: "#" },
    { name: "Facebook", icon: <Facebook/>, href: "#" },
  ];

  return (
    <footer className="relative w-full bg-[#543310] text-[#F8F4E1] py-12 md:py-16 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-3 tracking-wider">
              Widyatara
            </h3>
            <p className="text-sm text-[#F8F4E1]/70 italic max-w-xs mx-auto md:mx-0">
              Menjelajahi Kekayaan Budaya Nusantara dalam Dimensi Berbeda
            </p>
            <div className="h-1 w-16 bg-[#AF8F6F] mt-4 mx-auto md:mx-0" />
          </motion.div>

          {/* kinks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4 text-[#AF8F6F]">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    className="text-sm text-[#F8F4E1]/80 hover:text-[#AF8F6F] transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4 text-[#AF8F6F]">
              Ikuti Kami
            </h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border-2 border-[#AF8F6F]/30 flex items-center justify-center text-xs font-bold hover:bg-[#AF8F6F] hover:border-[#AF8F6F] transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="h-px bg-[#AF8F6F]/20 mb-6" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F8F4E1]/60"
        >
          <p>{currentYear} Widyatara. Semua hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#AF8F6F] transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-[#AF8F6F] transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
