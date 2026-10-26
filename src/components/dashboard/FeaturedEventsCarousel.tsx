"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Trophy, 
  Calendar, 
  ExternalLink,
  Loader2,
  Check
} from "lucide-react";
import { EventRecord } from "@/app/api/events/route";
import EventDetailModal from "./EventDetailModal";

interface FeaturedEventsCarouselProps {
  userId?: string;
}

export default function FeaturedEventsCarousel({ userId }: FeaturedEventsCarouselProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = userId ? `/api/events?userId=${encodeURIComponent(userId)}` : "/api/events";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setError("Unable to load featured events.");
      }
    } catch (err) {
      setError("Failed to connect to events service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  // Smooth scroll left and right
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 320; // approximate width of one card + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  };

  // Toggle bookmark/save event
  const handleToggleSave = async (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic UI update
      setEvents((prev) =>
        prev.map((ev) => (ev.id === eventId ? { ...ev, is_saved: !ev.is_saved } : ev))
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent((prev) => prev ? { ...prev, is_saved: !prev.is_saved } : null);
      }

      await fetch("/api/events/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId }),
      });
    } catch (err) {
      console.warn("Could not save event:", err);
      // Revert on failure
      fetchEvents();
    }
  };

  // Open modal for details
  const handleCardClick = (event: EventRecord) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Visual poster renderer for each competition
  const renderPosterCard = (event: EventRecord) => {
    const style = event.banner_style || {};
    const theme = style.theme || "corporate";

    if (theme === "corporate") {
      // White/Rose style like HDFC Life Aspire 3.0
      return (
        <div className="w-full h-full bg-gradient-to-b from-rose-50 via-white to-neutral-50 p-5 flex flex-col justify-between border border-rose-100 select-none">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-rose-600 text-white rounded">
                Case Challenge
              </span>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">
                {event.organizer}
              </span>
            </div>

            <h4 className="text-sm font-black text-neutral-900 leading-snug">
              {style.headline || "Solve a real business case. Win up to ₹1.8 lakh."}
            </h4>

            <div className="p-3 bg-white rounded-xl border border-rose-200/80 shadow-2xs space-y-1.5">
              <span className="text-xs font-black tracking-tight text-rose-600 block">
                {event.title}
              </span>
              <p className="text-[10px] text-neutral-600 leading-tight">
                {style.subHeadline || "National case-study competition for MBA & college students"}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-rose-100">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-500 font-bold">Prize:</span>
              <span className="font-extrabold text-neutral-900">{event.prize_pool}</span>
            </div>
            <div className="w-full py-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold text-center">
              Register on EdWorld
            </div>
          </div>
        </div>
      );
    }

    if (theme === "automotive") {
      // Royal blue style like Eurogrip TORQ Challenge 4.0
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-950 to-black p-5 text-white flex flex-col justify-between select-none">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-white/20 text-white backdrop-blur-xs rounded">
                National Case
              </span>
              <span className="text-[10px] font-mono text-blue-200 font-bold">
                {event.organizer}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-base font-black tracking-widest text-white uppercase block font-mono">
                TORQ 4.0
              </span>
              <h4 className="text-xs font-extrabold text-blue-100 leading-snug">
                {style.headline || "Write a great case study. Make a case for your career!"}
              </h4>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-blue-300 block">
                Awards &amp; PPIs:
              </span>
              <p className="text-[11px] font-extrabold text-white">
                {event.prize_pool}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="w-full py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold text-center tracking-wider uppercase">
              Register Now
            </div>
          </div>
        </div>
      );
    }

    if (theme === "hacker") {
      // Builder / Hacker dark style like DJXHack Residency
      return (
        <div className="w-full h-full bg-gradient-to-br from-stone-900 via-neutral-900 to-black p-5 text-white flex flex-col justify-between border border-neutral-800 select-none">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-amber-500 text-black font-extrabold rounded">
                Residency
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {event.organizer}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-neutral-400 block tracking-wider">
                DJX HACK
              </span>
              <h4 className="text-sm font-black text-white leading-tight uppercase font-mono">
                {style.headline || "BUILD IT FROM HOME"}
              </h4>
              <p className="text-[10px] text-neutral-400">
                Ideas. Code. Interact. Anywhere.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[9px] text-neutral-400 block font-mono">Prize</span>
                <span className="text-[10px] font-bold text-amber-400 font-mono">₹75,000</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[9px] text-neutral-400 block font-mono">Residency</span>
                <span className="text-[10px] font-bold text-white font-mono">Sponsored</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="w-full py-1.5 rounded-lg bg-white text-black text-[10px] font-extrabold text-center tracking-wider uppercase">
              Participate Now →
            </div>
          </div>
        </div>
      );
    }

    if (theme === "networking") {
      // Dark corporate networking style like LinkedIn x Unstop
      return (
        <div className="w-full h-full bg-gradient-to-br from-sky-950 via-slate-900 to-black p-5 text-white flex flex-col justify-between select-none">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                Career Sprint
              </span>
              <span className="text-[10px] font-mono text-sky-300 font-bold">
                {event.organizer}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-white leading-tight">
                {style.headline || "Get Unstoppable on LinkedIn"}
              </h4>
              <p className="text-[10px] text-neutral-300">
                Show up. Speak up. Stand out. Build your high-signal presence.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-sky-400 block">
                Executive Perks:
              </span>
              <p className="text-[11px] font-medium text-neutral-200">
                Priority Recruiter Referrals &amp; Mentorship
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="w-full py-1.5 rounded-lg bg-white text-slate-900 text-[10px] font-bold text-center">
              Register Now
            </div>
          </div>
        </div>
      );
    }

    // Default National Hackathon theme (SIH / Flipkart GRiD)
    return (
      <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-5 text-white flex flex-col justify-between border border-neutral-800 select-none">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-200 rounded">
              {event.category}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {event.organizer}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-white leading-snug">
              {event.title}
            </h4>
            <p className="text-[10px] text-neutral-400 line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 block font-mono">
              Grand Prize Pool:
            </span>
            <span className="text-xs font-black text-white font-mono block">
              {event.prize_pool}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="w-full py-1.5 rounded-lg bg-neutral-100 hover:bg-white text-black text-[10px] font-bold text-center">
            View Challenge Details
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4 font-sans">
      {/* Header with Title & Arrow Navigation Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black flex items-center gap-2">
            <span>Featured</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Premier national hackathons, case competitions, and innovation residencies
          </p>
        </div>

        {/* Circular Slider Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-neutral-300 hover:border-black hover:bg-neutral-50 text-black flex items-center justify-center transition-all shadow-xs cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-neutral-300 hover:border-black hover:bg-neutral-50 text-black flex items-center justify-center transition-all shadow-xs cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 flex items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>Loading featured competitions...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
          {error}
        </div>
      )}

      {/* Horizontal Carousel Track */}
      {!loading && events.length > 0 && (
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => handleCardClick(event)}
              className="flex-shrink-0 w-[270px] sm:w-[290px] group cursor-pointer snap-start flex flex-col justify-between"
            >
              {/* Vertical Poster Card Graphic (~3:4 aspect ratio) */}
              <div className="w-full h-[360px] sm:h-[380px] rounded-2xl overflow-hidden shadow-xs border border-neutral-200 group-hover:border-neutral-400 group-hover:shadow-md transition-all duration-200 relative">
                {renderPosterCard(event)}
              </div>

              {/* Badges & Save Row Underneath Poster */}
              <div className="pt-3 pb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-neutral-200 bg-white text-neutral-700">
                    {event.mode}
                  </span>
                  {event.is_free && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-neutral-200 bg-white text-neutral-700">
                      Free
                    </span>
                  )}
                  {event.registration_status === "Closing Soon" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-neutral-300 bg-neutral-100 text-neutral-900 font-mono">
                      Closing Soon
                    </span>
                  )}
                </div>

                {/* Heart Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(event.id, e)}
                  className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors ${
                    event.is_saved ? "text-black" : "text-neutral-400 hover:text-black"
                  }`}
                  aria-label={event.is_saved ? "Saved" : "Save competition"}
                  title={event.is_saved ? "Saved" : "Save competition"}
                >
                  <Heart className={`w-4 h-4 ${event.is_saved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Event Title & Organizer */}
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs sm:text-sm text-black group-hover:underline line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-[11px] text-neutral-500 font-mono line-clamp-1">
                  {event.organizer} • {event.prize_pool}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleSave={(id) => handleToggleSave(id)}
      />
    </section>
  );
}
