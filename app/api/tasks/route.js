import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { buildDays, parseTaskInput, serializeTask } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    return ok(tasks.map(serializeTask));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request) {
  try {
    const parsed = parseTaskInput(await readJson(request));
    if (parsed.error) return fail(parsed.error);
    const { startDate, duration } = parsed.data;

    await connectDB();
    const task = await Task.create({
      ...parsed.data,
      dates: buildDays(startDate, duration),
    });
    return ok(serializeTask(task.toObject()), 201);
  } catch (err) {
    return handleError(err);
  }
}   