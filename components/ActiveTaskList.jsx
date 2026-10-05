"use client";
import AnimatedNumber from "./AnimatedNumber";
import ProgressBar from "./ProgressBar";
import { taskStats, taskStatus } from "@/lib/stats";

export default function ActiveTaskList({ tasks, today }) {
  const active = tasks.filter((t) => taskStatus(t, today) === "active");

  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Active tasks</h2>
      {active.length === 0 ? (
        <p className="muted text-sm">No active tasks right now.</p>
      ) : (
        <div className="space-y-5">
          {active.map((task) => {
            const s = taskStats(task);
            return (
              <div key={task.id}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="muted shrink-0 text-xs font-medium">
                    {s.completed}/{s.total} days ·{" "}
                    <span style={{ color: "var(--text)" }}>
                      <AnimatedNumber value={s.percent} suffix="%" />
                    </span>
                  </p>
                </div>
                <ProgressBar percent={s.percent} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}