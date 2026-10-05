"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/dates";

export default function DailyTracker({ days, today, onToggle }) {
  const scroller = useRef(null);
  const todayRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const container = scroller.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 4);
  }

  useEffect(() => {
    const container = scroller.current;
    const el = todayRef.current;
    if (container && el) {
      container.scrollTo({
        left: Math.max(0, el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2),
        behavior: "smooth",
      });
    }
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  return (
    <div className="date-scroller-wrap px-12">
      <button
        type="button"
        className="date-scroller-control date-scroller-control-left"
        onClick={() => scroller.current?.scrollBy({ left: -240, behavior: "smooth" })}
        disabled={!canScrollLeft}
        aria-label="Show earlier dates"
      >
        ‹
      </button>
     
      <div
        ref={scroller}
        onScroll={updateScrollState}
        className="date-scroller no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 py-1"
        tabIndex="0"
        role="region"
        aria-label="Task dates"
      >
        {days.map((d, i) => {
          const isToday = d.date === today;
          const future = d.date > today;
          const day = d.date.slice(8);
          const label = i === 0 || day === "01" ? `${formatDate(d.date, { month: "short" })} ${day}` : day;
          return (
            <motion.button
              key={d.date}
              ref={isToday ? todayRef : null}
              type="button"
              disabled={future}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                navigator.vibrate?.(8);
                onToggle(d.date, !d.completed);
              }}
              className="day shrink-0 snap-start"
              data-done={d.completed}
              data-today={isToday}
              aria-pressed={d.completed}
              aria-label={`${formatDate(d.date, { month: "long", day: "numeric" })}${future ? ", upcoming" : d.completed ? ", completed" : ""}`}
            >
              {d.completed ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <motion.path
                    d="M3.5 8.5l3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </svg>
              ) : (
                <span className="day-dot" />
              )}
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>
      
      <button
        type="button"
        className="date-scroller-control date-scroller-control-right"
        onClick={() => scroller.current?.scrollBy({ left: 240, behavior: "smooth" })}
        disabled={!canScrollRight}
        aria-label="Show later dates"
      >
        ›
      </button>
    </div>
  );
}