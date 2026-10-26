"use client";
import { SectionErrorUI } from "@/components/ui/SectionErrorUI";

export default function SectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SectionErrorUI
      error={error}
      reset={reset}
      sectionName="Dashboard"
      returnHref="/dashboard"
      returnLabel="Reload Dashboard"
    />
  );
}
