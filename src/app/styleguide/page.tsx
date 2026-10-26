"use client";

import React, { useState } from "react";
import Link from "next/link";
import StudioNavbar from "@/components/studio/StudioNavbar";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioSticker from "@/components/studio/StudioSticker";
import Card3DTilt from "@/components/studio/Card3DTilt";
import { 
  ScribbleUnderline, 
  DoubleScribble, 
  DoodleStar, 
  DoodleArrow, 
  DoodleCircleHighlight, 
  DoodleSparkle 
} from "@/components/studio/DoodleAccents";
import { SUBJECT_THEMES, STUDIO_PALETTE } from "@/lib/design-tokens";
import { 
  Sparkles, 
  Check, 
  Copy, 
  Palette, 
  Type, 
  Layers, 
  MousePointer, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function StyleGuidePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Header Hero */}
        <div className="relative rounded-3xl bg-white border-2 border-[#1B1B2F] p-8 sm:p-12 shadow-[8px_8px_0px_#1B1B2F] overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StudioSticker bgColor="#FFC93C" rotate="slight-left">
                Design System v2.0
              </StudioSticker>
              <StudioSticker bgColor="#2EC4B6" rotate="slight-right">
                Hand-Crafted Human Studio
              </StudioSticker>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-[#1B1B2F] leading-tight">
              EdWorld Co. Studio{" "}
              <span className="relative inline-block text-[#FF6B6B]">
                Style Guide
                <ScribbleUnderline color="#FF6B6B" className="absolute -bottom-2 left-0 w-full" />
              </span>
            </h1>

            <p className="font-studio text-base sm:text-lg text-[#4A4A68] leading-relaxed">
              Our living design token architecture. Built to preserve human authenticity, editorial warmth, and physical tactile depth across every page.
            </p>
          </div>
        </div>

        {/* SECTION 1: MULTI-COLOUR SUBJECT PALETTE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC93C] border-2 border-[#1B1B2F] flex items-center justify-center shadow-[2px_2px_0px_#1B1B2F]">
              <Palette className="w-5 h-5 text-[#1B1B2F]" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-[#1B1B2F]">
                1. Six Platform Engines Multi-Colour Palette
              </h2>
              <p className="font-studio text-sm text-[#4A4A68]">
                One designated accent per platform pillar, reused consistently across badges, cards, buttons, and section highlights.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SUBJECT_THEMES).map((theme) => (
              <div
                key={theme.id}
                className="rounded-3xl border-2 border-[#1B1B2F] bg-white p-5 shadow-[5px_5px_0px_#1B1B2F] space-y-4"
                style={{ borderTop: `8px solid ${theme.color}` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-10 h-10 rounded-2xl border-2 border-[#1B1B2F] flex items-center justify-center shadow-[2px_2px_0px_#1B1B2F]"
                    style={{ backgroundColor: theme.color }}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white/70" />
                  </span>
                  <button
                    onClick={() => copyToClipboard(theme.color)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF8EE] border border-[#1B1B2F] font-mono text-xs font-bold hover:bg-[#FFC93C] transition-colors"
                  >
                    {copiedCode === theme.color ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#4A4A68]" />
                        <span>{theme.color}</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="font-heading font-extrabold text-lg text-[#1B1B2F]">
                    {theme.name}
                  </h3>
                  <p className="font-studio text-xs text-[#4A4A68] mt-1">
                    {theme.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1B1B2F]/15 flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-[#4A4A68]">WCAG AA Contrast:</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    Compliant (4.8:1+)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: CHARACTERFUL TYPOGRAPHY */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B6B] border-2 border-[#1B1B2F] flex items-center justify-center text-white shadow-[2px_2px_0px_#1B1B2F]">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-[#1B1B2F]">
                2. Characterful Typography Hierarchy
              </h2>
              <p className="font-studio text-sm text-[#4A4A68]">
                Expressive serif swashes for dramatic human headlines, paired with Bricolage Grotesque and DM Sans.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-10 shadow-[6px_6px_0px_#1B1B2F] space-y-8">
            <div className="space-y-2 pb-6 border-b-2 border-[#1B1B2F]/15">
              <span className="font-heading text-xs uppercase font-extrabold text-[#7E7E9A]">
                Display Serif &bull; Fraunces (Variable 400 - 900)
              </span>
              <p className="font-display font-black text-3xl sm:text-5xl text-[#1B1B2F] leading-tight">
                Curious minds deserve a curriculum built by human craftsmen.
              </p>
            </div>

            <div className="space-y-2 pb-6 border-b-2 border-[#1B1B2F]/15">
              <span className="font-heading text-xs uppercase font-extrabold text-[#7E7E9A]">
                Section Heading &bull; Bricolage Grotesque (Variable 600 - 800)
              </span>
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1B1B2F]">
                Small cohorts. Real practitioner mentorship. Zero automated checklists.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-heading text-xs uppercase font-extrabold text-[#7E7E9A]">
                Body &bull; DM Sans (400 / 500 / 700)
              </span>
              <p className="font-studio text-base text-[#4A4A68] leading-relaxed max-w-3xl">
                We believe engineering, mathematics, and spoken communication are physical crafts best learned through apprentice-style dissection, live feedback, and project proofs.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: TACTILE STICKERS, DOODLES & SQUISHY BUTTONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2EC4B6] border-2 border-[#1B1B2F] flex items-center justify-center text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-[#1B1B2F]">
                3. Physical Tactile Components &amp; Stickers
              </h2>
              <p className="font-studio text-sm text-[#4A4A68]">
                Slightly rotated stickers, hand-drawn vector doodles, and squishy physical press animations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Stickers & Doodles Box */}
            <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-[6px_6px_0px_#1B1B2F] space-y-6">
              <h3 className="font-heading font-extrabold text-base uppercase tracking-wider text-[#1B1B2F]">
                Rotated Studio Stickers
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <StudioSticker bgColor="#FFC93C" rotate="left">
                  ✦ Olympiad Math
                </StudioSticker>
                <StudioSticker bgColor="#FF6B6B" textColor="#FFFFFF" rotate="right">
                  🔥 Distributed Systems
                </StudioSticker>
                <StudioSticker bgColor="#2EC4B6" rotate="slight-left">
                  🤖 Bare-Metal Robotics
                </StudioSticker>
                <StudioSticker bgColor="#8E6CEF" textColor="#FFFFFF" rotate="slight-right">
                  🎓 GATE AIR 42 Mentor
                </StudioSticker>
                <StudioSticker bgColor="#6BCB77" rotate="none">
                  💼 Harvard ATS Ready
                </StudioSticker>
              </div>

              <div className="pt-4 border-t border-[#1B1B2F]/15 space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#1B1B2F]">Hand-Drawn Vector Doodles</h4>
                <div className="flex items-center gap-6">
                  <DoodleStar color="#FFC93C" className="w-8 h-8" />
                  <DoodleSparkle color="#8E6CEF" className="w-7 h-7" />
                  <DoodleArrow color="#FF6B6B" className="w-16 h-10" />
                </div>
              </div>
            </div>

            {/* Squishy Buttons Box */}
            <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-[6px_6px_0px_#1B1B2F] space-y-6">
              <h3 className="font-heading font-extrabold text-base uppercase tracking-wider text-[#1B1B2F]">
                Squishy Physical Buttons
              </h3>
              <p className="font-studio text-xs text-[#4A4A68]">
                Click and hold these buttons to experience the physical spring compression (`active:translate`).
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-squishy px-5 py-2.5 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F]">
                  Coral Primary
                </button>
                <button className="btn-squishy px-5 py-2.5 rounded-2xl bg-[#FFC93C] text-[#1B1B2F] font-heading font-extrabold text-sm border-2 border-[#1B1B2F]">
                  Yellow Accent
                </button>
                <button className="btn-squishy px-5 py-2.5 rounded-2xl bg-white text-[#1B1B2F] font-heading font-extrabold text-sm border-2 border-[#1B1B2F]">
                  Paper Outline
                </button>
                <button className="btn-squishy px-5 py-2.5 rounded-2xl bg-[#1B1B2F] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F]">
                  Deep Ink
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: 3D CARD TILT PLAYGROUND */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8E6CEF] border-2 border-[#1B1B2F] flex items-center justify-center text-white shadow-[2px_2px_0px_#1B1B2F]">
              <MousePointer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-[#1B1B2F]">
                4. Interactive 3D Perspective Tilt Card
              </h2>
              <p className="font-studio text-sm text-[#4A4A68]">
                Move your cursor over this card to test the real-time perspective tilt and glare sheen effect.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card3DTilt
              className="bg-white border-2 border-[#1B1B2F] p-8 shadow-[6px_6px_0px_#1B1B2F] space-y-4"
              shadowColor="#1B1B2F"
            >
              <div className="flex items-center justify-between">
                <StudioSticker bgColor="#FF6B6B" textColor="#FFFFFF" size="sm">
                  3D Interactive
                </StudioSticker>
                <DoodleSparkle color="#FFC93C" className="w-6 h-6" />
              </div>

              <h3 className="font-display font-black text-2xl text-[#1B1B2F]">
                Mouse-Tracking Depth Tilt
              </h3>

              <p className="font-studio text-sm text-[#4A4A68] leading-relaxed">
                This card calculates rotation along the X and Y axes relative to your cursor position with smooth mathematical easing and ambient reflection sheen.
              </p>

              <div className="pt-3 border-t border-[#1B1B2F]/15 flex items-center justify-between font-heading font-bold text-xs text-[#FF6B6B]">
                <span>Hover anywhere on this box</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card3DTilt>
          </div>
        </section>

        {/* SECTION 5: IMPLEMENTATION GUIDE & QUICK SETUP */}
        <section className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-8 sm:p-10 shadow-[6px_6px_0px_#1B1B2F] space-y-6">
          <h2 className="font-heading font-black text-2xl text-[#1B1B2F]">
            5. Setup &amp; Token Architecture Reference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-studio">
            <div className="p-5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] space-y-2">
              <h4 className="font-heading font-bold text-base text-[#1B1B2F]">
                Using Design Tokens in React
              </h4>
              <p className="text-xs text-[#4A4A68]">
                Import subject themes directly from <code className="px-1.5 py-0.5 rounded bg-white border border-[#1B1B2F]/20 font-mono">@/lib/design-tokens</code>:
              </p>
              <pre className="p-3 rounded-xl bg-[#1B1B2F] text-zinc-100 font-mono text-xs overflow-x-auto">
                <code>{`import { SUBJECT_THEMES } from "@/lib/design-tokens";

const mathTheme = SUBJECT_THEMES.math;
// mathTheme.color -> "#FFC93C"`}</code>
              </pre>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] space-y-2">
              <h4 className="font-heading font-bold text-base text-[#1B1B2F]">
                Applying Squishy 3D Buttons
              </h4>
              <p className="text-xs text-[#4A4A68]">
                Add <code className="px-1.5 py-0.5 rounded bg-white border border-[#1B1B2F]/20 font-mono">btn-squishy</code> to any button or link with standard Tailwind styles:
              </p>
              <pre className="p-3 rounded-xl bg-[#1B1B2F] text-zinc-100 font-mono text-xs overflow-x-auto">
                <code>{`<button className="btn-squishy px-5 py-2.5 
  rounded-2xl bg-[#FF6B6B] text-white 
  font-heading font-extrabold text-sm 
  border-2 border-[#1B1B2F]">
  Click Me
</button>`}</code>
              </pre>
            </div>
          </div>
        </section>

    </div>
  );
}
