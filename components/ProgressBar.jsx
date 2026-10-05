"use client";
import { motion } from "framer-motion";

export default function ProgressBar({ percent, height = "h-1.5" }) {
  const value = Math.min(100, Math.max(0, Number(percent) || 0));

  return (
    <div
      className={`${height} w-full overflow-hidden rounded-full surface-2`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`${value}% complete`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: value === 100 ? "var(--success)" : "var(--accent)" }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 110, damping: 24 }}
      />
    </div>
  );
}