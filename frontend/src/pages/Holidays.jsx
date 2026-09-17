import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, EmptyState } from "../components/Feedback";
import { IconPlus, IconTrash } from "../components/Icons";
import { useToast } from "../components/Toast";

const holidayService = {
  list: () => api.get("/holidays"),
  create: (data) => api.post("/holidays", data),
  remove: (id) => api.delete(`/holidays/${id}`),
};

export default function Holidays() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", date: "", description: "" });

  const load = () => {
    setLoading(true);
    holidayService.list().then((res) => setItems(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    try {
      await holidayService.create(form);
      setForm({ name: "", date: "", description: "" });
      toast.push("Holiday added");
      load();
    } catch {
      toast.push("Could not add holiday", "error");
    }
  };

  const remove = async (id) => {
    try {
      await holidayService.remove(id);
      toast.push("Holiday removed");
      load();
    } catch {
      toast.push("Could not remove holiday", "error");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">Holidays</h1>
      <p className="text-sm text-slate mb-6">Company-wide holiday calendar.</p>

      <form onSubmit={submit} className="bg-white border border-line rounded-2xl p-5 mb-6 grid sm:grid-cols-4 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" placeholder="Eid-ul-Fitr" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate uppercase mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-sm" />
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brandd transition-colors">
          <IconPlus className="w-4 h-4" /> Add
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No holidays scheduled" />
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <ul className="divide-y divide-line">
            {items.map((h) => (
              <li key={h.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <span>
                  <span className="font-medium text-navy">{h.name}</span>
                  <span className="text-slate ml-3">{h.date}</span>
                </span>
                <button onClick={() => remove(h.id)} className="text-slate hover:text-red-600"><IconTrash className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
