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
      sectionName="Admin Panel"
      returnHref="/admin"
      returnLabel="Back to Admin"
    />
  );
}
