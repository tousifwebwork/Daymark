"use client";
import { motion } from "framer-motion";
import { todayEntries } from "@/lib/stats";

export default function TodayProgress({ tasks, today, onToggle }) {
  const entries = todayEntries(tasks, today).sort((a, b) => Number(a.done) - Number(b.done));
  const done = entries.filter((e) => e.done).length;

  return (
    <section className="surface rounded-3xl p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Today’s progress</h2>
        <p className="muted text-xs font-medium">
          {entries.length - done} pending · {done} completed
        </p>
      </div>
      {entries.length === 0 ? (
        <p className="muted py-3 text-sm">Nothing scheduled for today.</p>
      ) : (
        <div>
          {entries.map(({ task, done: isDone }) => (
            <motion.button
              layout
              key={task.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(task.id, today, !isDone)}
              className="flex min-h-14 w-full items-center gap-3 text-left"
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors"
                style={{
                  borderColor: isDone ? "var(--accent)" : "var(--border)",
                  background: isDone ? "var(--accent)" : "transparent",
                  color: "var(--accent-fg)",
                }}
              >
                {isDone && (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</span>
              <span className={`text-xs font-semibold ${isDone ? "success-text" : "muted"}`}>
                {isDone ? "Completed" : "Pending"}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}