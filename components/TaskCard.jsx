"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import DailyTracker from "./DailyTracker";
import ProgressBar from "./ProgressBar";
import { formatDate } from "@/lib/dates";
import { endDate, taskStats, taskStatus } from "@/lib/stats";

function statusLabel(task, today) {
  const status = taskStatus(task, today);
  if (status === "upcoming") return `Starts ${formatDate(task.startDate)}`;
  if (status === "ended") return "Ended";
  return `Day ${task.dates.findIndex((d) => d.date === today) + 1} of ${task.dates.length}`;
}

export default function TaskCard({ task, today, index = 0, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const stats = taskStats(task);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: Math.min(index, 6) * 0.05 }}
      className="surface rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {statusLabel(task, today)}
          </span>
          <h2 className="text-lg font-semibold leading-snug tracking-tight">{task.title}</h2>
          {task.description && <p className="muted mt-1 text-sm leading-relaxed">{task.description}</p>}
        </div>

        <div ref={menuRef} className="relative -mr-2 -mt-1 shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Task options"
            aria-expanded={menuOpen}
            className="muted grid h-11 w-11 place-items-center rounded-full text-xl"
          >
            ⋯
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.14 }}
                style={{ transformOrigin: "top right" }}
                className="surface absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-2xl p-1"
              >
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium"
                  onClick={() => { setMenuOpen(false); onEdit(task); }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-medium"
                  style={{ color: "var(--danger)" }}
                  onClick={() => { setMenuOpen(false); onDelete(task); }}
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="muted mt-3 text-xs font-medium">
        {formatDate(task.startDate)} → {formatDate(endDate(task))} · {stats.total} days
      </p>

      <div className="mt-4 flex items-end justify-between">
        <p className="muted text-sm">
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            <AnimatedNumber value={stats.completed} />
          </span>{" "}
          done ·{" "}
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            <AnimatedNumber value={stats.remaining} />
          </span>{" "}
          left
        </p>
        <p className="text-2xl font-semibold tracking-tight">
          <AnimatedNumber value={stats.percent} suffix="%" />
        </p>
      </div>
      <div className="mt-2">
        <ProgressBar percent={stats.percent} />
      </div>

      <div className="mt-4">
        <DailyTracker days={task.dates} today={today} onToggle={onToggle} />
      </div>
    </motion.article>
  );
}