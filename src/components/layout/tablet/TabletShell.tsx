"use client";

import React, { useState } from "react";
import TabletDock from "./TabletDock";
import TabletHeader from "./TabletHeader";

interface TabletShellProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function TabletShell({ children, onSearch }: TabletShellProps) {
  return (
    <div className="min-h-screen w-full tablet-viewport-bg py-2 sm:py-5 md:py-8 px-1.5 sm:px-3 md:px-6 flex items-center justify-center font-sans antialiased text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Physical Dark Tablet Bezel Frame */}
      <div className="w-full max-w-[1480px] mx-auto bg-[#17181c] rounded-[32px] sm:rounded-[44px] md:rounded-[52px] p-2 sm:p-3 md:p-4 shadow-tablet border border-white/10 flex flex-col min-h-[900px]">
        
        {/* Tablet Inner Body: Left Dock + White Content Canvas */}
        <div className="flex-1 flex flex-row w-full bg-white rounded-[24px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden min-h-[850px]">
          
          {/* 1. Left Vertical Slim Dark Dock */}
          <TabletDock />

          {/* 2. Main Pristine Content Canvas */}
          <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-6 md:p-8 overflow-y-auto max-h-[92vh] scrollbar-thin">
            {/* Top Bar matching reference */}
            <TabletHeader onSearch={onSearch} />

            {/* Dynamic Page Workspace Content */}
            <div className="flex-1 pt-4 sm:pt-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
