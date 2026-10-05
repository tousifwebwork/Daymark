import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { buildDays, isValidId, parseTaskInput, serializeTask } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid task ID");
    await connectDB();
    const task = await Task.findById(id).lean();
    if (!task) return fail("Task not found", 404);
    return ok(serializeTask(task));
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid task ID");
    const parsed = parseTaskInput(await readJson(request));
    if (parsed.error) return fail(parsed.error);
    const { title, description, startDate, duration } = parsed.data;

    await connectDB();
    const task = await Task.findById(id);
    if (!task) return fail("Task not found", 404);

    task.title = title;
    task.description = description;
    task.startDate = startDate;
    task.duration = duration;
    task.dates = buildDays(startDate, duration, task.dates);
    await task.save();

    return ok(serializeTask(task.toObject()));
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid task ID");
    await connectDB();
    const deleted = await Task.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Task not found", 404);
    return ok({ id });
  } catch (err) {
    return handleError(err);
  }
}