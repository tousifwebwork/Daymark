"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { todayString } from "@/lib/dates";

const PRESETS = [7, 20, 30, 50, 60];

export default function TaskForm({ initial, submitLabel, onSubmit }) {
  const initialDuration = initial?.duration ?? 30;
  const isPreset = PRESETS.includes(initialDuration);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayString());
  const [preset, setPreset] = useState(isPreset ? initialDuration : "custom");
  const [custom, setCustom] = useState(isPreset ? "" : String(initialDuration));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const duration = preset === "custom" ? Number(custom) : preset;
  const shrinking = initial && Number.isInteger(duration) && duration < initial.duration;

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    if (!title.trim()) return setError("Give your task a title.");
    if (!startDate) return setError("Pick a start date.");
    if (!Number.isInteger(duration) || duration < 1 || duration > 365) {
      return setError("Duration must be between 1 and 365 days.");
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({ title, description, startDate, duration });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const label = "muted mb-1.5 block text-xs font-semibold uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={label} htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          className="field"
          value={title}
          maxLength={100}
          autoFocus={!initial}
          placeholder="Read 20 pages"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className={label} htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          className="field"
          rows={2}
          maxLength={500}
          placeholder="Read a minimum of 20 pages every day."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className={label} htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          name="startDate"
          required
          type="date"
          className="field"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <span className={label}>Duration</span>
        <div className="flex flex-wrap gap-2">
          {[...PRESETS, "custom"].map((p) => {
            const active = preset === p;
            return (
              <motion.button
                key={p}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setPreset(p)}
                className="min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors"
                style={{
                  background: active ? "var(--accent)" : "var(--surface-2)",
                  color: active ? "var(--accent-fg)" : "var(--text)",
                }}
              >
                {p === "custom" ? "Custom" : `${p} days`}
              </motion.button>
            );
          })}
        </div>
        {preset === "custom" && (
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={365}
            className="field mt-3"
            placeholder="Number of days (1–365)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        )}
        {shrinking && (
          <p className="muted mt-2 text-xs">
            Days after day {duration} will be removed, along with their progress.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}