"use client";
import { useEffect, useState } from "react";
import { todayString } from "@/lib/dates";

export default function useToday() {
  const [today, setToday] = useState(null);

  useEffect(() => {
    const update = () => setToday(todayString());
    update();
    const interval = setInterval(update, 60000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return today;
}