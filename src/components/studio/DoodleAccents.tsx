"use client";

import React from "react";

interface DoodleProps {
  color?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Hand-drawn wavy underline for dramatic emphasis on editorial headings.
 */
export function ScribbleUnderline({
  color = "#FFC93C",
  className = "",
  width = "100%",
  height = "16",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 280 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M3 13.5C45.2 6.8 98.4 4.5 142.5 8.2C188 12 234 14.5 277 5.5"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 16C68 10 135 7.8 195 10.5C225 11.8 255 13.8 270 9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

/**
 * Hand-drawn double underline for secondary emphasis.
 */
export function DoubleScribble({
  color = "#FF6B6B",
  className = "",
  width = "100%",
  height = "14",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 5C60 2 150 2 218 6"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M8 11C75 8 160 8.5 210 11"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Playful hand-drawn 4-point star doodle.
 */
export function DoodleStar({
  color = "#FFC93C",
  className = "w-6 h-6",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 2C16.8 9 19.5 12.2 26 13C28 13.2 30 13.5 30 16C30 18.5 28 18.8 26 19C19.5 19.8 16.8 23 16 30C15.2 23 12.5 19.8 6 19C4 18.8 2 18.5 2 16C2 13.5 4 13.2 6 13C12.5 12.2 15.2 9 16 2Z"
        fill={color}
        stroke="#1B1B2F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn squiggly arrow pointing to CTAs or featured elements.
 */
export function DoodleArrow({
  color = "#1B1B2F",
  className = "w-16 h-12",
  direction = "right",
}: DoodleProps & { direction?: "right" | "down" | "left" }) {
  const transform =
    direction === "down"
      ? "rotate(75deg)"
      : direction === "left"
      ? "scaleX(-1)"
      : "none";

  return (
    <svg
      viewBox="0 0 80 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform }}
      aria-hidden="true"
    >
      <path
        d="M4 28C22 18 42 16 68 22"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 1"
      />
      <path
        d="M52 10C58 16 68 22 72 23C66 28 58 36 54 42"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn circle highlight around words or numbers.
 */
export function DoodleCircleHighlight({
  color = "#2EC4B6",
  className = "absolute inset-0 pointer-events-none -m-2",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 160 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M12 30C8 14 35 6 80 6C130 6 154 16 150 34C145 52 110 56 65 55C25 54 4 44 14 26"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 2"
      />
    </svg>
  );
}

/**
 * Playful sparkle doodle.
 */
export function DoodleSparkle({
  color = "#8E6CEF",
  className = "w-5 h-5",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z"
        fill={color}
        stroke="#1B1B2F"
        strokeWidth="1.5"
      />
    </svg>
  );
}
