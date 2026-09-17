import { useEffect, useState } from "react";
import { departmentService, designationService } from "../../services/employeeService";
import { Loader, EmptyState } from "../../components/Feedback";
import { IconPlus, IconTrash } from "../../components/Icons";
import { useToast } from "../../components/Toast";

export default function Departments() {
  const toast = useToast();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDept, setNewDept] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTitleDept, setNewTitleDept] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([departmentService.list(), designationService.list()])
      .then(([d, t]) => { setDepartments(d.data.data); setDesignations(t.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const addDept = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;
    try {
      await departmentService.create({ name: newDept.trim() });
      setNewDept("");
      toast.push("Department created");
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not create department", "error");
    }
  };

  const removeDept = async (id) => {
    try {
      await departmentService.remove(id);
      toast.push("Department deleted");
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not delete department", "error");
    }
  };

  const addTitle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await designationService.create({ title: newTitle.trim(), department_id: newTitleDept || null });
      setNewTitle("");
      toast.push("Designation created");
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not create designation", "error");
    }
  };

  const removeTitle = async (id) => {
    try {
      await designationService.remove(id);
      toast.push("Designation deleted");
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not delete designation", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Departments &amp; Designations</h1>
      <p className="text-sm text-slate mb-6">Organize your company structure.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Departments</h2>
          <form onSubmit={addDept} className="flex gap-2 mb-4">
            <input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="New department name" className="flex-1 border border-line rounded-lg px-3 py-2 text-sm" />
            <button className="bg-brand text-white rounded-lg px-3.5 py-2 hover:bg-brandd transition-colors"><IconPlus className="w-4 h-4" /></button>
          </form>
          {departments.length === 0 ? (
            <EmptyState title="No departments yet" />
          ) : (
            <ul className="divide-y divide-line">
              {departments.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    <span className="font-medium text-navy">{d.name}</span>
                    <span className="text-slate ml-2">({d.employees_count ?? 0} employees)</span>
                  </span>
                  <button onClick={() => removeDept(d.id)} className="text-slate hover:text-red-600"><IconTrash className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Designations</h2>
          <form onSubmit={addTitle} className="flex flex-wrap gap-2 mb-4">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New designation title" className="flex-1 min-w-[140px] border border-line rounded-lg px-3 py-2 text-sm" />
            <select value={newTitleDept} onChange={(e) => setNewTitleDept(e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm">
              <option value="">No department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button className="bg-brand text-white rounded-lg px-3.5 py-2 hover:bg-brandd transition-colors"><IconPlus className="w-4 h-4" /></button>
          </form>
          {designations.length === 0 ? (
            <EmptyState title="No designations yet" />
          ) : (
            <ul className="divide-y divide-line">
              {designations.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    <span className="font-medium text-navy">{d.title}</span>
                    <span className="text-slate ml-2">{d.department?.name ? `· ${d.department.name}` : ""}</span>
                  </span>
                  <button onClick={() => removeTitle(d.id)} className="text-slate hover:text-red-600"><IconTrash className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
