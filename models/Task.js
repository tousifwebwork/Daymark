import mongoose from "mongoose";

const dateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, default: "", maxlength: 500 },
    startDate: { type: String, required: true },
    duration: { type: Number, required: true, min: 1, max: 365 },
    dates: { type: [dateSchema], required: true, default: [] },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;