"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CardProps {
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
  variant?: "editorial" | "expand" | "flat";
  onClick?: () => void;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  href,
  icon,
  badge,
  className = "",
  variant = "editorial",
  onClick,
  children,
}) => {
  if (variant === "expand") {
    const expandContent = (
      <div className={`card-hover-expand ${className}`} onClick={onClick}>
        <div className="go-corner">
          <div className="go-arrow">→</div>
        </div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-200 mb-3 shadow-xs">
            {badge}
          </span>
        )}
        {icon && <div className="mb-3 text-black">{icon}</div>}
        <h3 className="card-title font-display">{title}</h3>
        <p className="small-desc">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
    if (href) return <Link href={href} className="block group">{expandContent}</Link>;
    return expandContent;
  }

  const editorialContent = (
    <div
      className={`relative bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs hover:shadow-md hover:border-black transition-all duration-300 flex flex-col justify-between group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {badge ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-200">
              {badge}
            </span>
          ) : <div />}
          {href && (
            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:bg-neutral-100 transition-colors">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          )}
        </div>

        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
            {icon}
          </div>
        )}

        <h3 className="text-xl font-bold font-display text-black tracking-tight mb-2 group-hover:text-neutral-800 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {children && <div className="mt-6 pt-4 border-t border-neutral-100">{children}</div>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {editorialContent}
      </Link>
    );
  }

  return editorialContent;
};

export default Card;
