"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useTasks from "@/hooks/useTasks";
import useToday from "@/hooks/useToday";
import { formatDate } from "@/lib/dates";
import { taskStatus, todayEntries } from "@/lib/stats";
import AnimatedNumber from "@/components/AnimatedNumber";
import CreateTaskModal from "@/components/CreateTaskModal";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import EditTaskModal from "@/components/EditTaskModal";
import EmptyState from "@/components/EmptyState";
import ProgressBar from "@/components/ProgressBar";
import TaskCard from "@/components/TaskCard";

export default function HomePage() {
  const { tasks, loading, error, reload, createTask, updateTask, deleteTask, toggleDay } = useTasks();
  const today = useToday();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const editingId = editing?.id;
  const deletingId = deleting?.id;

  const ready = !loading && !!today;

  const ordered = useMemo(() => {
    if (!today) return tasks;
    const rank = { active: 0, upcoming: 1, ended: 2 };
    return [...tasks].sort((a, b) => rank[taskStatus(a, today)] - rank[taskStatus(b, today)]);
  }, [tasks, today]);

  const entries = ready ? todayEntries(tasks, today) : [];
  const doneToday = entries.filter((e) => e.done).length;
  const percent = entries.length ? Math.round((doneToday / entries.length) * 100) : 0;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="muted text-sm font-medium">
          {today ? formatDate(today, { weekday: "long", month: "long", day: "numeric" }) : "\u00A0"}
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Today</h1>

        {ready && entries.length > 0 && (
          <div className="surface mt-5 rounded-3xl p-5">
            <div className="flex items-end justify-between">
              <p className="text-sm font-medium">
                <span className="text-2xl font-semibold tracking-tight">
                  <AnimatedNumber value={doneToday} />
                </span>
                <span className="muted"> of {entries.length} done today</span>
              </p>
              <p className="muted text-sm font-semibold">
                <AnimatedNumber value={percent} suffix="%" />
              </p>
            </div>
            <div className="mt-3">
              <ProgressBar percent={percent} height="h-2" />
            </div>
          </div>
        )}
      </motion.section>

      {error && (
        <div className="surface mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-ghost" onClick={reload}>Retry</button>
        </div>
      )}

      {!ready && !error && (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="surface h-60 animate-pulse rounded-3xl" />
          ))}
        </div>
      )}

      {ready && tasks.length === 0 && !error && (
        <EmptyState
          title="No tasks yet"
          description="Create a challenge and tick off each day to build a consistent streak."
        >
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            Create your first task
          </button>
        </EmptyState>
      )}

      {ready && (
        <div className="space-y-4">
          <AnimatePresence>
            {ordered.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                today={today}
                index={i}
                onToggle={(date, completed) => toggleDay(task.id, date, completed)}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <motion.button
        type="button"
        aria-label="Create task"
        onClick={() => setCreating(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.3 }}
        className="fixed z-40 grid h-16 w-16 place-items-center rounded-full text-3xl shadow-xl"
        style={{
          background: "var(--accent)",
          color: "var(--accent-fg)",
          bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
          right: "max(1.25rem, calc((100vw - 48rem) / 2 + 1.25rem))",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </motion.button>

      <CreateTaskModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={async (input) => {
          await createTask(input);
          setCreating(false);
        }}
      />
      <EditTaskModal
        task={editing}
        onClose={() => setEditing(null)}
        onSave={async (input) => {
          if (!editingId) return;
          await updateTask(editingId, input);
          setEditing(null);
        }}
      />
      <DeleteConfirmation
        task={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deletingId) return;
          await deleteTask(deletingId);
          setDeleting(null);
        }}
      />
    </>
  );
}