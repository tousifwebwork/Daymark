import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { isValidDateString, todayString } from "@/lib/dates";
import { isValidId, serializeTask } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid task ID");

    const body = await readJson(request);
    if (!isValidDateString(body?.date) || typeof body?.completed !== "boolean") {
      return fail("A valid date and completed (true/false) are required");
    }
    if (body.date > todayString()) {
      return fail("Future dates cannot be completed");
    }

    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: id, "dates.date": body.date },
      { $set: { "dates.$[d].completed": body.completed } },
      { arrayFilters: [{ "d.date": body.date }], new: true }
    ).lean();

    if (!task) return fail("Task or date not found", 404);
    return ok(serializeTask(task));
  } catch (err) {
    return handleError(err);
  }
}