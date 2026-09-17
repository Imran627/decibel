export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate text-sm gap-2">
      <span className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></span>
      {label}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", subtitle }) {
  return (
    <div className="text-center py-16">
      <p className="font-display font-semibold text-navy">{title}</p>
      {subtitle && <p className="text-sm text-slate mt-1">{subtitle}</p>}
    </div>
  );
}

export function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
      {message}
    </div>
  );
}
