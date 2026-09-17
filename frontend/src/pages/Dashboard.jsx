import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { StatCard } from "../components/Badges";
import { Loader, ErrorMessage } from "../components/Feedback";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService
      .stats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Dashboard</h1>
      <p className="text-sm text-slate mb-6">A live snapshot of your workforce.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees" value={stats.total_employees} />
        <StatCard label="Active Employees" value={stats.active_employees} accent="text-green-600" />
        <StatCard label="Departments" value={stats.departments} />
        <StatCard label="New This Month" value={stats.new_employees_this_month} />
        <StatCard label="Present Today" value={stats.present_today} accent="text-green-600" />
        <StatCard label="Absent Today" value={stats.absent_today} accent="text-red-600" />
        <StatCard label="On Leave Today" value={stats.on_leave_today} accent="text-blue-600" />
        <StatCard label="Pending Leave Requests" value={stats.pending_leave_requests} accent="text-orange-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Upcoming Birthdays</h2>
          {stats.upcoming_birthdays?.length ? (
            <ul className="space-y-3">
              {stats.upcoming_birthdays.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{e.first_name} {e.last_name}</span>
                  <span className="text-slate">{e.date_of_birth}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate">No birthdays in the next 30 days.</p>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Upcoming Holidays</h2>
          {stats.upcoming_holidays?.length ? (
            <ul className="space-y-3">
              {stats.upcoming_holidays.map((h) => (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{h.name}</span>
                  <span className="text-slate">{h.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate">No holidays scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
