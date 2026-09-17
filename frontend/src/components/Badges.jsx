const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  present: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-600",
  absent: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  terminated: "bg-red-100 text-red-700",
  pending: "bg-orange-100 text-orange-700",
  late: "bg-orange-100 text-orange-700",
  half_day: "bg-orange-100 text-orange-700",
  work_from_home: "bg-blue-100 text-blue-700",
  on_leave: "bg-blue-100 text-blue-700",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
      {status?.replaceAll("_", " ")}
    </span>
  );
}

export function StatCard({ label, value, sub, accent = "text-navy" }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5">
      <p className="text-xs font-semibold text-slate uppercase tracking-wide">{label}</p>
      <p className={`font-display text-2xl font-extrabold mt-2 ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-slate mt-1">{sub}</p>}
    </div>
  );
}
