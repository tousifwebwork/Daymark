"use client";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import ProgressBar from "./ProgressBar";
import { overallStats, taskStatus, todayEntries } from "@/lib/stats";

export default function DashboardStats({ tasks, today }) {
  const all = overallStats(tasks);
  const entries = todayEntries(tasks, today);
  const doneToday = entries.filter((e) => e.done).length;
  const active = tasks.filter((t) => taskStatus(t, today) === "active").length;

  const cards = [
    { label: "Active tasks", value: active },
    { label: "Days completed", value: all.completed },
    { label: "Days pending", value: all.pending },
    { label: "Done today", value: doneToday, of: entries.length },
  ];

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface rounded-3xl p-6"
      >
        <p className="muted text-xs font-semibold uppercase tracking-wide">Overall progress</p>
        <p className="mt-2 text-6xl font-semibold tracking-tight">
          <AnimatedNumber value={all.percent} suffix="%" />
        </p>
        <div className="mt-4">
          <ProgressBar percent={all.percent} height="h-2" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * (i + 1) }}
            className="surface rounded-3xl p-5"
          >
            <p className="muted text-xs font-semibold uppercase tracking-wide">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              <AnimatedNumber value={c.value} />
              {c.of !== undefined && <span className="muted text-xl"> / {c.of}</span>}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}