"use client";
import Sheet from "./Sheet";
import TaskForm from "./TaskForm";

export default function EditTaskModal({ task, onClose, onSave }) {
  return (
    <Sheet open={!!task} onClose={onClose} title="Edit challenge">
      {task && (
        <TaskForm key={task.id} initial={task} submitLabel="Save changes" onSubmit={onSave} />
      )}
    </Sheet>
  );
}