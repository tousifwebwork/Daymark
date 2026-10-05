"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Today" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ borderColor: "var(--border)",  background: "color-mix(in srgb, var(--bg) 82%, transparent)",paddingTop: "env(safe-area-inset-top)",  }}  >
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 mt-6 md:mt-0">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span  className="grid h-7 w-7 place-items-center rounded-lg text-sm"  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
            ✓
          </span>
          Daymark
        </Link>
        <nav className="surface-2 flex rounded-full p-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex h-9 items-center px-4 text-sm font-medium ${active ? "" : "muted"}`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="surface absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}