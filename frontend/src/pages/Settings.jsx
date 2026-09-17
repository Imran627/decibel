import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, EmptyState } from "../components/Feedback";
import { IconPlus, IconCheck } from "../components/Icons";
import { useToast } from "../components/Toast";

export default function Settings() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/users"),
      api.get("/admin/roles"),
      api.get("/admin/permissions"),
    ])
      .then(([u, r, p]) => {
        setUsers(u.data.data.data || u.data.data);
        setRoles(r.data.data);
        setPermissions(p.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", form);
      toast.push("User created");
      setForm({ name: "", email: "", password: "", role_id: "" });
      load();
    } catch (err) {
      toast.push(err.response?.data?.message || "Could not create user", "error");
    }
  };

  const openRolePerms = (role) => {
    setEditingRole(role);
    setSelectedPerms(role.permissions.map((p) => p.id));
  };

  const togglePerm = (id) => {
    setSelectedPerms((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const savePerms = async () => {
    try {
      await api.put(`/admin/roles/${editingRole.id}/permissions`, { permission_ids: selectedPerms });
      toast.push("Permissions updated");
      setEditingRole(null);
      load();
    } catch {
      toast.push("Could not update permissions", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Settings</h1>
      <p className="text-sm text-slate mb-6">Manage users, roles, and permissions.</p>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Add User</h2>
          <form onSubmit={createUser} className="space-y-3">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
            <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
            <select required value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm">
              <option value="">Select role</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <button className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brandd transition-colors">
              <IconPlus className="w-4 h-4" /> Create User
            </button>
          </form>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-4">Roles</h2>
          <ul className="divide-y divide-line">
            {roles.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="font-medium text-navy">{r.label}</span>
                  <span className="text-slate ml-2">({r.permissions.length} permissions)</span>
                </span>
                <button onClick={() => openRolePerms(r)} className="text-brand text-xs font-semibold hover:underline">Edit permissions</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <h2 className="font-display font-bold text-navy mb-4">Users</h2>
        {users.length === 0 ? (
          <EmptyState title="No users yet" />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 font-medium text-navy">{u.name}</td>
                  <td className="py-2.5 text-ink/80">{u.email}</td>
                  <td className="py-2.5 text-ink/80">{u.role?.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingRole && (
        <div className="fixed inset-0 z-50 bg-navy/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="font-display font-bold text-navy text-lg mb-4">Permissions — {editingRole.label}</h3>
            <div className="space-y-2 mb-6">
              {permissions.map((p) => (
                <label key={p.id} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={selectedPerms.includes(p.id)} onChange={() => togglePerm(p.id)} className="accent-brand w-4 h-4" />
                  {p.label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingRole(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate hover:bg-paper transition-colors">Cancel</button>
              <button onClick={savePerms} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brandd transition-colors">
                <IconCheck className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
