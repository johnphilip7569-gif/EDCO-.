"use client";

import React, { useRef, useEffect, useState } from "react";
import { Code2, EyeOff, ShieldCheck } from "lucide-react";

interface AntiOcrCodeCanvasProps {
  code: string;
  language?: string;
  watermarkText?: string;
  className?: string;
}

export default function AntiOcrCodeCanvas({
  code,
  language = "Algorithm Trace",
  watermarkText = "EDWORLD-DSA-SECURED",
  className = "",
}: AntiOcrCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(720);
  const [isBlackedOut, setIsBlackedOut] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 680);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Instant blackout on screenshot shortcut modifiers or window focus loss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        e.key === "Meta" ||
        e.key === "OS" ||
        (e.ctrlKey && e.shiftKey) ||
        (e.metaKey && e.shiftKey)
      ) {
        setIsBlackedOut(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        try {
          navigator.clipboard?.writeText("Protected Code Snippet — Copying & Screenshots Prohibited");
        } catch (_) {}
      }
      setTimeout(() => {
        if (document.hasFocus() && !document.hidden) {
          setIsBlackedOut(false);
        }
      }, 600);
    };

    const handleBlur = () => setIsBlackedOut(true);
    const handleFocus = () => setIsBlackedOut(false);
    const handleVisibility = () => {
      if (document.hidden) setIsBlackedOut(true);
      else if (document.hasFocus()) setIsBlackedOut(false);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    const isCompactMobile = containerWidth < 420;
    const fontSize = isCompactMobile ? 11.5 : 13.5;
    const lineHeight = isCompactMobile ? 19 : 22;
    const paddingX = isCompactMobile ? 10 : 16;
    const paddingY = isCompactMobile ? 12 : 16;
    const gutterWidth = isCompactMobile ? 28 : 36;

    const rawLines = (code || "").replace(/\r\n/g, "\n").split("\n");
    const totalHeight = Math.max(84, rawLines.length * lineHeight + paddingY * 2);

    canvas.width = containerWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${totalHeight}px`;

    ctx.scale(dpr, dpr);

    // 1. Dark Terminal Background
    ctx.fillStyle = "#0F1117";
    ctx.fillRect(0, 0, containerWidth, totalHeight);

    if (isBlackedOut) {
      ctx.fillStyle = "#090A0F";
      ctx.fillRect(0, 0, containerWidth, totalHeight);
      ctx.fillStyle = "#F87171";
      ctx.font = `700 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "🔒 CODE TRACE PROTECTED AGAINST SCREENSHOTS & CAMERA OCR",
        containerWidth / 2,
        totalHeight / 2
      );
      return;
    }

    // 2. High-Frequency Dark-Mode Moiré Interference Grid
    // Disrupts mobile camera exposure and creates rainbow aliasing on CMOS sensors
    ctx.strokeStyle = "rgba(56, 189, 248, 0.055)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let x = -totalHeight; x < containerWidth + totalHeight; x += 5) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + totalHeight, totalHeight);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(168, 85, 247, 0.045)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let y = 0; y < totalHeight; y += 3) {
      ctx.moveTo(0, y);
      ctx.lineTo(containerWidth, y);
    }
    ctx.stroke();

    // 3. Tiled Forensic Watermark
    ctx.save();
    ctx.font = `700 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.045)";
    ctx.rotate(-0.1);
    for (let wy = -20; wy < totalHeight + 60; wy += 42) {
      for (let wx = -40; wx < containerWidth + 100; wx += 210) {
        ctx.fillText(watermarkText, wx, wy);
      }
    }
    ctx.restore();

    // 4. Line Number Gutter Separator
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(gutterWidth + 4, 0, 1, totalHeight);

    // 5. Render Monospace Code with Sub-Pixel Jitter & Stem Micro-Cuts
    ctx.font = `500 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    rawLines.forEach((line, lineIdx) => {
      const y = paddingY + lineIdx * lineHeight;

      // Draw Line Number
      ctx.fillStyle = "#64748B";
      ctx.fillText(String(lineIdx + 1).padStart(2, " "), 10, y);

      // Draw Code Characters
      let cursorX = paddingX + gutterWidth;
      for (let cIdx = 0; cIdx < line.length; cIdx++) {
        const ch = line[cIdx];
        if (ch === " ") {
          cursorX += ctx.measureText(" ").width;
          continue;
        }

        const jitterY = ((lineIdx + cIdx) % 2 === 0) ? 0.35 : -0.35;
        ctx.fillStyle = "#F1F5F9";
        ctx.fillText(ch, cursorX, y + jitterY);

        // Micro-cut across glyph to break OCR character segmentation
        if (cIdx % 2 === 0) {
          ctx.fillStyle = "rgba(15, 17, 23, 0.32)";
          ctx.fillRect(cursorX, y + jitterY + 6, ctx.measureText(ch).width, 0.85);
        }

        cursorX += ctx.measureText(ch).width;
      }
    });
  }, [code, containerWidth, watermarkText, isBlackedOut]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none edworld-protected-view rounded-xl overflow-hidden border border-neutral-800 bg-[#0F1117] shadow-inner ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800 bg-[#161922] text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold text-neutral-200">
          {isBlackedOut ? (
            <EyeOff className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Anti-OCR Code Canvas • Non-Executable</span>
        </div>
      </div>

      <div className="p-1 overflow-x-auto">
        <canvas
          ref={canvasRef}
          className="block max-w-full"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            pointerEvents: "none",
            WebkitTouchCallout: "none",
          }}
          aria-label="Protected Code Snippet"
        />
      </div>
    </div>
  );
}
