"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <a
      href="https://blog.hae02y.me"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 opacity-30 hover:opacity-70 transition-opacity"
    >
      <Image src="/logo-dark.svg" alt="hae02y" width={28} height={19} />
      <span className="text-[10px] text-white/60 tracking-widest">hae02y</span>
    </a>
  );
}
