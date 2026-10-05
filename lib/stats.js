export function taskStats(task) {
  const total = task.dates.length;
  const completed = task.dates.filter((d) => d.completed).length;
  return {
    total,
    completed,
    remaining: total - completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export const endDate = (task) => task.dates[task.dates.length - 1]?.date ?? task.startDate;

export function taskStatus(task, today) {
  if (today < task.startDate) return "upcoming";
  if (today > endDate(task)) return "ended";
  return "active";
}

export function todayEntries(tasks, today) {
  return tasks
    .filter((t) => taskStatus(t, today) === "active")
    .map((task) => ({
      task,
      done: task.dates.find((d) => d.date === today)?.completed === true,
    }));
}

export function overallStats(tasks) {
  let total = 0;
  let completed = 0;
  for (const t of tasks) {
    const s = taskStats(t);
    total += s.total;
    completed += s.completed;
  }
  return {
    total,
    completed,
    pending: total - completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}