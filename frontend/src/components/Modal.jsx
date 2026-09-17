export function ConfirmModal({ open, title, body, onConfirm, onCancel, confirmLabel = "Confirm" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-navy/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-display font-bold text-navy text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate mb-6">{body}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-paper transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-line disabled:opacity-40 hover:border-brand transition-colors"
      >
        Prev
      </button>
      <span className="text-sm text-slate">Page {page} of {lastPage}</span>
      <button
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-line disabled:opacity-40 hover:border-brand transition-colors"
      >
        Next
      </button>
    </div>
  );
}
