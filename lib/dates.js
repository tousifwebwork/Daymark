const pad = (n) => String(n).padStart(2, "0");
const toParts = (s) => s.split("-").map(Number);

export function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isValidDateString(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = toParts(s);
  if (y < 2000 || y > 2100) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function addDays(s, n) {
  const [y, m, d] = toParts(s);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function generateDates(start, duration) {
  return Array.from({ length: duration }, (_, i) => addDays(start, i));
}

export function formatDate(s, options = { month: "short", day: "numeric" }) {
  const [y, m, d] = toParts(s);
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}