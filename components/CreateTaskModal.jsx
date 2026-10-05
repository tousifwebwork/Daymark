"use client";
import Sheet from "./Sheet";
import TaskForm from "./TaskForm";

export default function CreateTaskModal({ open, onClose, onCreate }) {
  return (
    <Sheet open={open} onClose={onClose} title="New challenge">
      <TaskForm submitLabel="Start challenge" onSubmit={onCreate} />
    </Sheet>
  );
}