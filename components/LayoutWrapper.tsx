"use client";

import React, { ReactNode } from "react";
import { useTransitionContext } from "./TransitionContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

// Some pages might not want global navbar/footer if needed,
// but for now we assume global usage.

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { isAnimating } = useTransitionContext();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isNoNavPage =
    pathname === "/" ||
    pathname === "/Jawa/game1" ||
    pathname === "/Jawa/game2" ||
    pathname === "/Papua/game1"||
    pathname === "/Papua/game2"||
    pathname === "/Kalimantan/game1"||
    pathname === "/Kalimantan/game2"||
    pathname === "/Sulawesi/game1"||
    pathname === "/Sulawesi/game2"||
    pathname === "/Maluku/game1"||
    pathname === "/Maluku/game2"||
    pathname === "/Sumatera/game1"||
    pathname === "/Sumatera/game2";

  if (isAuthPage || isNoNavPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`transition-opacity duration-500 ${
          isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Navbar />
      </div>

      {children}

      <div
        className={`transition-opacity duration-500 ${
          isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Footer />
      </div>
    </>
  );
}
