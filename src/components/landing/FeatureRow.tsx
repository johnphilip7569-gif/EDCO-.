import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface FeatureRowProps {
  pillLabel: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel?: string;
  ctaHref?: string;
  previewVisual: React.ReactNode;
  reversed?: boolean;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({
  pillLabel,
  title,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  previewVisual,
  reversed = false
}) => {
  return (
    <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-14 py-8`}>
      {/* Content Col */}
      <div className="flex-1 space-y-4">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-200">
          {pillLabel}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-black tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed font-normal">
          {description}
        </p>

        <ul className="space-y-2.5 pt-2">
          {bullets.map((b, idx) => (
            <li key={idx} className="text-xs text-black flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {ctaLabel && ctaHref && (
          <div className="pt-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Visual Col */}
      <div className="flex-1 w-full max-w-lg">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          {previewVisual}
        </div>
      </div>
    </div>
  );
};

export default FeatureRow;
