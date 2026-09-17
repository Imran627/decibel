import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService, departmentService, designationService } from "../../services/employeeService";
import { useToast } from "../../components/Toast";
import { Loader } from "../../components/Feedback";

const EMPTY = {
  first_name: "", last_name: "", email: "", phone: "", date_of_birth: "", gender: "",
  address: "", city: "", country: "", department_id: "", designation_id: "",
  employment_type: "full_time", joining_date: "", work_location: "", salary: "",
  status: "active", emergency_contact_name: "", emergency_contact_phone: "",
  bank_name: "", bank_account_number: "",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    departmentService.list().then((res) => setDepartments(res.data.data));
    designationService.list().then((res) => setDesignations(res.data.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    employeeService.get(id).then((res) => {
      const e = res.data.data;
      setForm({
        ...EMPTY,
        ...e,
        department_id: e.department?.id || "",
        designation_id: e.designation?.id || "",
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) {
        await employeeService.update(id, form);
        toast.push("Employee updated");
      } else {
        await employeeService.create(form);
        toast.push("Employee created");
      }
      navigate("/employees");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.push("Could not save employee", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const field = (label, key, type = "text", opts = {}) => (
    <div>
      <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={set(key)}
        {...opts}
        className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
      />
      {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key][0]}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold text-navy mb-1">{isEdit ? "Edit Employee" : "Add Employee"}</h1>
      <p className="text-sm text-slate mb-6">Fields marked required must be completed.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 space-y-8">
        <section>
          <h2 className="font-display font-bold text-navy mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("First Name *", "first_name", "text", { required: true })}
            {field("Last Name *", "last_name", "text", { required: true })}
            {field("Email *", "email", "email", { required: true })}
            {field("Phone", "phone")}
            {field("Date of Birth", "date_of_birth", "date")}
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">Gender</label>
              <select value={form.gender} onChange={set("gender")} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-navy mb-4">Employment</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">Department</label>
              <select value={form.department_id} onChange={set("department_id")} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">Designation</label>
              <select value={form.designation_id} onChange={set("designation_id")} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
                <option value="">Select designation</option>
                {designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">Employment Type *</label>
              <select value={form.employment_type} onChange={set("employment_type")} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            {field("Joining Date", "joining_date", "date")}
            {field("Work Location", "work_location")}
            {field("Salary", "salary", "number")}
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={set("status")} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-navy mb-4">Address</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {field("Address", "address")}
            {field("City", "city")}
            {field("Country", "country")}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-navy mb-4">Emergency &amp; Bank</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("Emergency Contact Name", "emergency_contact_name")}
            {field("Emergency Contact Phone", "emergency_contact_phone")}
            {field("Bank Name", "bank_name")}
            {field("Bank Account Number", "bank_account_number")}
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <button type="button" onClick={() => navigate("/employees")} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate hover:bg-paper transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brandd transition-colors disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
