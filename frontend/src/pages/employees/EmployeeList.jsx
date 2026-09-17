import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { employeeService, departmentService } from "../../services/employeeService";
import { Loader, EmptyState, ErrorMessage } from "../../components/Feedback";
import { StatusBadge } from "../../components/Badges";
import { Pagination, ConfirmModal } from "../../components/Modal";
import { IconPlus, IconSearch, IconEdit, IconTrash } from "../../components/Icons";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";

export default function EmployeeList() {
  const { can } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    employeeService
      .list({ search, department_id: departmentId, status, page, per_page: 10 })
      .then((res) => {
        setItems(res.data.data.items);
        setLastPage(res.data.data.pagination.last_page);
      })
      .catch(() => setError("Could not load employees."))
      .finally(() => setLoading(false));
  }, [search, departmentId, status, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { departmentService.list().then((res) => setDepartments(res.data.data)); }, []);

  const handleDelete = async () => {
    try {
      await employeeService.remove(toDelete.id);
      toast.push("Employee deactivated");
      setToDelete(null);
      load();
    } catch {
      toast.push("Could not deactivate employee", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy">Employees</h1>
          <p className="text-sm text-slate">Manage your team's records.</p>
        </div>
        {can("employees.create") && (
          <Link to="/employees/new" className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brandd transition-colors">
            <IconPlus className="w-4 h-4" /> Add Employee
          </Link>
        )}
      </div>

      <div className="bg-white border border-line rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            placeholder="Search by name, email, code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }} className="border border-line rounded-lg text-sm px-3 py-2">
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-line rounded-lg text-sm px-3 py-2">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No employees found" subtitle="Try adjusting your search or filters." />
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Employee</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Department</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Designation</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-paper/60 transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/employees/${e.id}`} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-brand text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                        {e.first_name?.[0]}{e.last_name?.[0]}
                      </span>
                      <span>
                        <span className="block font-medium text-navy">{e.full_name}</span>
                        <span className="block text-xs text-slate">{e.employee_code}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-ink/80">{e.department?.name || "—"}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-ink/80">{e.designation?.title || "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {can("employees.edit") && (
                        <Link to={`/employees/${e.id}/edit`} className="text-slate hover:text-brand"><IconEdit className="w-4 h-4" /></Link>
                      )}
                      {can("employees.delete") && (
                        <button onClick={() => setToDelete(e)} className="text-slate hover:text-red-600"><IconTrash className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} lastPage={lastPage} onChange={setPage} />

      <ConfirmModal
        open={!!toDelete}
        title="Deactivate employee?"
        body={`${toDelete?.full_name} will be marked inactive. Historical records are kept.`}
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
