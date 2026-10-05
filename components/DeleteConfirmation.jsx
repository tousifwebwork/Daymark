"use client";
import { useState } from "react";
import Sheet from "./Sheet";

export default function DeleteConfirmation({ task, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <Sheet open={!!task} onClose={onCancel} title="Delete challenge?">
      <p className="muted text-sm leading-relaxed">
        “{task?.title}” and all of its progress will be permanently deleted. This can’t be undone.
      </p>
      {error && (
        <p className="mt-3 text-sm font-medium" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={confirm} disabled={busy}>
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Sheet>
  );
}