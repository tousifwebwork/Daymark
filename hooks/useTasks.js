"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "";

async function request(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });
  let payload = null;
  try {
    payload = await res.json();
  } catch {}
  if (!res.ok) throw new Error(payload?.error || "Request failed");
  return payload.data;
}

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toggleQueues = useRef(new Map());

  const load = useCallback(async () => {
    try {
      const data = await request("/api/tasks");
      if (!Array.isArray(data)) throw new Error("The task response was invalid.");
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(load, 0);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(initialLoad);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const createTask = async (input) => {
    const task = await request("/api/tasks", { method: "POST", body: JSON.stringify(input) });
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = async (id, input) => {
    const task = await request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(input) });
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const deleteTask = async (id) => {
    await request(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDay = async (id, date, completed) => {
    const apply = (value) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id !== id
            ? t
            : { ...t, dates: t.dates.map((d) => (d.date === date ? { ...d, completed: value } : d)) }
        )
      );
    apply(completed);
    const key = `${id}:${date}`;
    const previous = toggleQueues.current.get(key) || Promise.resolve();
    const operation = previous
      .catch(() => {})
      .then(() =>
        request(`/api/tasks/${id}/toggle`, {
          method: "PATCH",
          body: JSON.stringify({ date, completed }),
        })
      );
    toggleQueues.current.set(key, operation);
    try {
      const saved = await operation;
      setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
    } catch {
      await load();
      setError("Couldn't save that change. Check your connection.");
    } finally {
      if (toggleQueues.current.get(key) === operation) toggleQueues.current.delete(key);
    }
  };

  return { tasks, loading, error, reload: load, createTask, updateTask, deleteTask, toggleDay };
}