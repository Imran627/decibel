import { useEffect, useState, useCallback } from "react";
import { attendanceService } from "../../services/attendanceService";
import { employeeService } from "../../services/employeeService";
import { Loader, EmptyState, ErrorMessage } from "../../components/Feedback";
import { StatusBadge } from "../../components/Badges";
import { Pagination } from "../../components/Modal";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

export default function Attendance() {
  const { can } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [employeeId, setEmployeeId] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    attendanceService
      .list({ date, employee_id: employeeId || undefined, page, per_page: 15 })
      .then((res) => {
        setItems(res.data.data.items);
        setLastPage(res.data.data.pagination.last_page);
      })
      .catch(() => setError("Could not load attendance."))
      .finally(() => setLoading(false));
  }, [date, employeeId, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { employeeService.list({ per_page: 100 }).then((res) => setEmployees(res.data.data.items)); }, []);

  const quickCheckIn = async (empId) => {
    try {
      await attendanceService.checkIn({ employee_id: empId, date, check_in: new Date().toTimeString().slice(0, 5) });
      toast.push("Checked in");
      load();
    } catch {
      toast.push("Check-in failed", "error");
    }
  };

  const quickCheckOut = async (empId) => {
    try {
      await attendanceService.checkOut({ employee_id: empId, date, check_out: new Date().toTimeString().slice(0, 5) });
      toast.push("Checked out");
      load();
    } catch {
      toast.push("Check-out failed", "error");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Attendance</h1>
      <p className="text-sm text-slate mb-6">Daily check-ins, check-outs, and history.</p>

      <div className="bg-white border border-line rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-line rounded-lg text-sm px-3 py-2" />
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="border border-line rounded-lg text-sm px-3 py-2">
          <option value="">All Employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
        </select>

        {can("attendance.manage") && employeeId && (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => quickCheckIn(employeeId)} className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors">
              Check In Now
            </button>
            <button onClick={() => quickCheckOut(employeeId)} className="text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors">
              Check Out Now
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No attendance records" subtitle="Try a different date or employee." />
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Employee</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-left px-5 py-3 font-semibold">Check In</th>
                <th className="text-left px-5 py-3 font-semibold">Check Out</th>
                <th className="text-left px-5 py-3 font-semibold">Hours</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-paper/60 transition-colors">
                  <td className="px-5 py-3 font-medium text-navy">{a.employee?.first_name} {a.employee?.last_name}</td>
                  <td className="px-5 py-3 text-ink/80">{a.date}</td>
                  <td className="px-5 py-3 text-ink/80">{a.check_in || "—"}</td>
                  <td className="px-5 py-3 text-ink/80">{a.check_out || "—"}</td>
                  <td className="px-5 py-3 text-ink/80">{a.work_hours ?? "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} lastPage={lastPage} onChange={setPage} />
    </div>
  );
}
