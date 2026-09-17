import { useEffect, useState, useCallback } from "react";
import { leaveService } from "../../services/leaveService";
import { employeeService } from "../../services/employeeService";
import { Loader, EmptyState, ErrorMessage } from "../../components/Feedback";
import { StatusBadge } from "../../components/Badges";
import { Pagination } from "../../components/Modal";
import { IconCheck, IconX, IconPlus } from "../../components/Icons";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequests() {
  const { can } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" });

  const load = useCallback(() => {
    setLoading(true);
    leaveService
      .requests({ status: status || undefined, page, per_page: 15 })
      .then((res) => {
        setItems(res.data.data.items);
        setLastPage(res.data.data.pagination.last_page);
      })
      .catch(() => setError("Could not load leave requests."))
      .finally(() => setLoading(false));
  }, [status, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    leaveService.types().then((res) => setTypes(res.data.data));
    employeeService.list({ per_page: 100 }).then((res) => setEmployees(res.data.data.items));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.submitRequest(form);
      toast.push("Leave request submitted");
      setShowForm(false);
      setForm({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" });
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not submit request", "error");
    }
  };

  const approve = async (id) => {
    try {
      await leaveService.approve(id);
      toast.push("Leave approved");
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not approve", "error");
    }
  };

  const reject = async (id) => {
    try {
      await leaveService.reject(id);
      toast.push("Leave rejected");
      load();
    } catch {
      toast.push("Could not reject", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy">Leave Requests</h1>
          <p className="text-sm text-slate">Review and manage employee leave.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brandd transition-colors">
          <IconPlus className="w-4 h-4" /> New Request
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-line rounded-2xl p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Employee</label>
            <select required value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm">
              <option value="">Select</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Leave Type</label>
            <select required value={form.leave_type_id} onChange={(e) => setForm({ ...form, leave_type_id: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm">
              <option value="">Select</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Start Date</label>
            <input required type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate uppercase mb-1.5">End Date</label>
            <input required type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Reason</label>
            <input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <button type="submit" className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brandd transition-colors">Submit Request</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-4">
        {["", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-colors ${status === s ? "bg-navy text-white" : "bg-white border border-line text-slate hover:border-brand"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No leave requests" />
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Employee</th>
                <th className="text-left px-5 py-3 font-semibold">Type</th>
                <th className="text-left px-5 py-3 font-semibold">Dates</th>
                <th className="text-left px-5 py-3 font-semibold">Days</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                {can("leaves.approve") && <th className="text-right px-5 py-3 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60 transition-colors">
                  <td className="px-5 py-3 font-medium text-navy">{r.employee?.full_name}</td>
                  <td className="px-5 py-3 text-ink/80">{r.leave_type?.name}</td>
                  <td className="px-5 py-3 text-ink/80">{r.start_date} → {r.end_date}</td>
                  <td className="px-5 py-3 text-ink/80">{r.total_days}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  {can("leaves.approve") && (
                    <td className="px-5 py-3">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => approve(r.id)} className="text-green-600 hover:text-green-700"><IconCheck className="w-4 h-4" /></button>
                          <button onClick={() => reject(r.id)} className="text-red-500 hover:text-red-700"><IconX className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <span className="text-slate text-xs text-right block">—</span>
                      )}
                    </td>
                  )}
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
