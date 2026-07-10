"use client";

import { useStore } from "./store";

export function ToastLayer() {
  const { toast, undo } = useStore();
  if (!toast) return null;
  return (
    <div className="toast-wrap">
      <div className="toast" role="status">
        <span>{toast.msg}</span>
        {toast.undoable && <button onClick={undo}>Undo</button>}
      </div>
    </div>
  );
}
