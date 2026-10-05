"use client";
import { motion } from "framer-motion";

export default function EmptyState({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface flex flex-col items-center rounded-3xl px-6 py-14 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-5 grid h-16 w-16 place-items-center rounded-2xl text-2xl"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        ✓
      </motion.div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="muted mt-1 max-w-xs text-sm">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}