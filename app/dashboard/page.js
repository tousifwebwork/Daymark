"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import useTasks from "@/hooks/useTasks";
import useToday from "@/hooks/useToday";
import ActiveTaskList from "@/components/ActiveTaskList";
import DashboardStats from "@/components/DashboardStats";
import EmptyState from "@/components/EmptyState";
import TodayProgress from "@/components/TodayProgress";

export default function DashboardPage() {
  const { tasks, loading, error, reload, toggleDay } = useTasks();
  const today = useToday();
  const ready = !loading && !!today;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="muted text-sm font-medium">Overview</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Dashboard</h1>
      </motion.header>

      {error && (
        <div className="surface mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-ghost" onClick={reload}>Retry</button>
        </div>
      )}

      {!ready && !error && (
        <div className="space-y-3">
          <div className="surface h-40 animate-pulse rounded-3xl" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface h-24 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      )}

      {ready && tasks.length === 0 && !error && (
        <EmptyState title="Nothing to show yet" description="Create a task and your progress will appear here.">
          <Link href="/" className="btn btn-primary">Go to Today</Link>
        </EmptyState>
      )}

      {ready && tasks.length > 0 && (
        <div className="space-y-3">
          <DashboardStats tasks={tasks} today={today} />
          <TodayProgress tasks={tasks} today={today} onToggle={toggleDay} />
          <ActiveTaskList tasks={tasks} today={today} />
        </div>
      )}
    </>
  );
}