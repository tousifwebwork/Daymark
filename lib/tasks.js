import { generateDates, isValidDateString } from "./dates";

export const MAX_DURATION = 365;

const OBJECT_ID = /^[a-f\d]{24}$/i;
export const isValidId = (id) => typeof id === "string" && OBJECT_ID.test(id);

export function parseTaskInput(body) {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return { error: "Title is required" };
  if (title.length > 100) return { error: "Title must be 100 characters or fewer" };

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (description.length > 500) return { error: "Description must be 500 characters or fewer" };

  if (!isValidDateString(body.startDate)) return { error: "Start date is invalid" };

  const duration = Number(body.duration);
  if (!Number.isInteger(duration) || duration < 1 || duration > MAX_DURATION) {
    return { error: `Duration must be a whole number between 1 and ${MAX_DURATION}` };
  }

  return { data: { title, description, startDate: body.startDate, duration } };
}

export function buildDays(startDate, duration, previous = []) {
  const done = new Map(previous.map((d) => [d.date, d.completed]));
  return generateDates(startDate, duration).map((date) => ({
    date,
    completed: done.get(date) === true,
  }));
}

export function serializeTask(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description || "",
    startDate: doc.startDate,
    duration: doc.duration,
    dates: doc.dates.map((d) => ({ date: d.date, completed: !!d.completed })),
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}