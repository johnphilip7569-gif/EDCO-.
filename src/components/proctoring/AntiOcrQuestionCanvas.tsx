"use client";

import React, { useRef, useEffect, useState } from "react";
import { ShieldCheck, EyeOff } from "lucide-react";

interface AntiOcrQuestionCanvasProps {
  text: string;
  category?: string;
  fontSize?: number;
  lineHeight?: number;
  textColor?: string;
  antiOcrStrength?: "standard" | "high";
  watermarkText?: string;
  className?: string;
}

export default function AntiOcrQuestionCanvas({
  text,
  category,
  fontSize = 17,
  lineHeight = 26,
  textColor = "#111827",
  antiOcrStrength = "high",
  watermarkText = "EDWORLD-SECURED",
  className = "",
}: AntiOcrQuestionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 120 });
  const [isBlackedOut, setIsBlackedOut] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Measure container width and resize dynamically
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth || 700;
        setDimensions((prev) => ({ ...prev, width: clientWidth }));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Instant blackout listener on screenshot shortcut modifiers or window blur
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
          navigator.clipboard?.writeText("Protected Content — Screenshots Prohibited by EdWorld Security");
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
    const isCompactMobile = dimensions.width < 420;
    const effectiveFontSize = isCompactMobile ? Math.max(13, fontSize - 1.5) : fontSize;
    const effectiveLineHeight = isCompactMobile ? Math.max(21, lineHeight - 2) : lineHeight;
    const paddingX = isCompactMobile ? 14 : 18;
    const paddingY = isCompactMobile ? 14 : 18;
    const maxContentWidth = Math.max(180, dimensions.width - paddingX * 2);

    // 1. Text wrapping calculation
    ctx.font = `600 ${effectiveFontSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const paragraphs = (text || "").split("\n");
    const lines: string[] = [];

    for (const para of paragraphs) {
      const words = para.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxContentWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    const calculatedHeight = Math.max(88, lines.length * effectiveLineHeight + paddingY * 2 + 12);

    // Resize canvas with high DPI backing
    canvas.width = dimensions.width * dpr;
    canvas.height = calculatedHeight * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${calculatedHeight}px`;

    // Normalize coordinates to DPR
    ctx.scale(dpr, dpr);

    // If blacked out due to screenshot / focus loss, render black security shield directly in canvas pixels
    if (isBlackedOut) {
      ctx.fillStyle = "#090A0F";
      ctx.fillRect(0, 0, dimensions.width, calculatedHeight);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `700 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "🔒 SCREENSHOT & CAMERA SHIELD ACTIVE — CLICK WINDOW TO RESUME",
        dimensions.width / 2,
        calculatedHeight / 2
      );
      return;
    }

    // 2. Clear canvas with base background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, dimensions.width, calculatedHeight);

    // 3. Multi-Angle Anti-Camera Moiré Interference Grating
    // Produces high-frequency chromatic & luminance aliasing on smartphone CMOS camera sensors
    if (antiOcrStrength === "high") {
      // Horizontal micro-scanlines
      ctx.fillStyle = "rgba(15, 23, 42, 0.022)";
      for (let y = 0; y < calculatedHeight; y += 2.5) {
        ctx.fillRect(0, y, dimensions.width, 0.7);
      }

      // Diagonal Moiré cross-grating (defeats phone camera autofocus & lens de-warping)
      ctx.strokeStyle = "rgba(37, 99, 235, 0.032)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (let x = -calculatedHeight; x < dimensions.width + calculatedHeight; x += 6) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + calculatedHeight, calculatedHeight);
      }
      ctx.stroke();

      // Counter-diagonal subtle chromatic grating
      ctx.strokeStyle = "rgba(220, 38, 38, 0.024)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = -calculatedHeight; x < dimensions.width + calculatedHeight; x += 8) {
        ctx.moveTo(x, calculatedHeight);
        ctx.lineTo(x + calculatedHeight, 0);
      }
      ctx.stroke();
    }

    // 4. Dynamic Forensic Tiled Watermark
    ctx.save();
    ctx.font = `700 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.038)";
    ctx.rotate(-0.12);
    for (let wy = -40; wy < calculatedHeight + 60; wy += 44) {
      for (let wx = -60; wx < dimensions.width + 100; wx += 220) {
        ctx.fillText(watermarkText, wx, wy);
      }
    }
    ctx.restore();

    // 5. Render text with adversarial glyph perturbation, micro-rotation & stem slicing
    ctx.font = `600 ${effectiveFontSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    lines.forEach((line, lineIndex) => {
      const lineY = paddingY + lineIndex * effectiveLineHeight;
      let cursorX = paddingX;

      const lineWords = line.split(" ");
      lineWords.forEach((word, wordIdx) => {
        for (let charIdx = 0; charIdx < word.length; charIdx++) {
          const char = word[charIdx];
          // Deterministic sub-pixel vertical & horizontal jitter + micro-rotation
          const seed = (lineIndex * 31 + wordIdx * 17 + charIdx * 13) % 7;
          const jitterY = (seed - 3) * 0.18;
          const angle = ((charIdx % 3) - 1) * 0.014;

          ctx.save();
          ctx.translate(cursorX, lineY + jitterY);
          ctx.rotate(angle);

          // Draw primary character glyph
          ctx.fillStyle = textColor;
          ctx.fillText(char, 0, 0);

          // Adversarial micro-slicing across character stems
          // Disrupts Otsu thresholding & connected-component character segmentation in Google Lens / Tesseract
          if (antiOcrStrength === "high") {
            ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
            const sliceY = (charIdx % 2 === 0) ? Math.floor(effectiveFontSize * 0.38) : Math.floor(effectiveFontSize * 0.62);
            ctx.fillRect(0, sliceY, ctx.measureText(char).width, 0.85);
          }

          ctx.restore();

          const charWidth = ctx.measureText(char).width;
          cursorX += charWidth + ((charIdx % 2 === 0) ? 0.15 : -0.1);
        }

        // Add space between words
        cursorX += ctx.measureText(" ").width;
      });
    });
  }, [text, dimensions.width, fontSize, lineHeight, textColor, antiOcrStrength, watermarkText, isBlackedOut]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none edworld-protected-view ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200/90 bg-white shadow-2xs">
        {/* Anti-OCR Watermark Indicator */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 bg-neutral-50/70 text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800">
            {isBlackedOut ? (
              <EyeOff className="w-3.5 h-3.5 text-red-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            )}
            <span>
              {isBlackedOut
                ? "Screen Capture Blocked — Focus Required"
                : "Anti-Camera Moiré & Anti-Screenshot Shield Active"}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400">
            {category ? `${category} • ` : ""}Zero-DOM Optical Canvas
          </span>
        </div>

        {/* The Secured Dynamic Canvas */}
        <div className="p-2 flex items-center justify-center bg-white cursor-default">
          <canvas
            ref={canvasRef}
            className="block max-w-full"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              pointerEvents: "none",
              WebkitTouchCallout: "none",
            }}
            aria-label="Protected Question Prompt"
          />
        </div>
      </div>
    </div>
  );
}
