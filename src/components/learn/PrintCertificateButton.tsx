"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.print();
        }
      }}
      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
    >
      <Printer className="w-4 h-4" />
      <span>Print Official Transcript</span>
    </button>
  );
}
