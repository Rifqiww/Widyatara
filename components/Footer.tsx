"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Beranda", href: "/" },
    { title: "Nusantara", href: "/nusantara" },
    { title: "Peta Budaya", href: "/map" },
    { title: "Timeline", href: "/timeline" },
    { title: "Tentang Kami", href: "/about" },
    { title: "Kontak", href: "/contact" },
  ];

  return (
    <footer className="relative w-full bg-[#543310] text-[#F8F4E1] py-4 px-4 md:px-6 overflow-hidden font-sans border-t border-[#AF8F6F]/20">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Metric / Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
          {/* Card 1: Brand */}
          <div className="flex flex-col justify-center">
            <div className="relative z-10 text-center md:text-left">
              <Link
                href="/"
                className="text-3xl md:text-4xl font-black font-serif tracking-tighter text-[#F8F4E1] hover:text-[#AF8F6F] transition-all duration-300 block"
              >
                WIDYATARA
              </Link>
            </div>
            <p className="text-xs md:text-sm text-[#F8F4E1]/60 mt-2 text-center md:text-left max-w-xs mx-auto md:mx-0">
              Menelusuri Jejak Peradaban, Merajut Masa Depan Bangsa.
            </p>
          </div>

          {/* Card 2: Navigation */}
          <div className="flex flex-col justify-center pl-0 md:pl-8">
            <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4 text-[#AF8F6F] border-b border-[#F8F4E1]/10 pb-2 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              Jelajahi
            </h3>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.title} className="overflow-hidden">
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-[#F8F4E1]/70 hover:text-[#F8F4E1] transition-colors duration-300"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#AF8F6F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Message Form */}
          <div className="flex flex-col justify-center relative overflow-hidden pl-0 md:pl-8">
            <h3 className="text-sm md:text-base font-bold mb-3 text-[#F8F4E1]">
              Kirim Pesan!
            </h3>
            <div className="flex flex-col gap-2 relative z-10">
              <textarea
                placeholder="Ada ide seru?"
                rows={1}
                className="w-full bg-[#000000]/20 border border-[#F8F4E1]/10 rounded-lg px-3 py-2 text-xs text-[#F8F4E1] placeholder:text-[#F8F4E1]/30 focus:outline-none focus:border-[#AF8F6F]/50 transition-all resize-none"
              />
              <button className="self-end bg-[#AF8F6F] hover:bg-[#8c6b4a] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer">
                Kirim
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-3 md:gap-4 border-t border-[#F8F4E1]/10 pt-3">
          <div className="text-[10px] md:text-xs font-medium text-[#F8F4E1]/50 flex items-center gap-2 text-center md:text-left">
            <span>&copy; {currentYear} Widyatara.</span>
          </div>

          <div className="flex gap-2">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="text-[#F8F4E1]/60 hover:text-[#F8F4E1] p-1.5 rounded-full hover:bg-[#F8F4E1]/10 transition-colors"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
