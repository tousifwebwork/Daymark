"use client";
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export default function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, suffix]);

  return <span ref={ref}>{`${value}${suffix}`}</span>;
}