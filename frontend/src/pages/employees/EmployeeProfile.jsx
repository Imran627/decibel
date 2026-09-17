import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { Loader, ErrorMessage } from "../../components/Feedback";
import { StatusBadge } from "../../components/Badges";
import { IconEdit } from "../../components/Icons";
import { useAuth } from "../../context/AuthContext";

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-line/70 text-sm">
      <span className="text-slate">{label}</span>
      <span className="text-ink font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const { can } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    employeeService.get(id).then((res) => setEmployee(res.data.data)).catch(() => setError("Could not load employee."));
    employeeService.leaveBalances(id).then((res) => setBalances(res.data.data)).catch(() => {});
  }, [id]);

  if (error) return <ErrorMessage message={error} />;
  if (!employee) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-brand text-white font-display font-bold text-lg flex items-center justify-center">
            {employee.first_name?.[0]}{employee.last_name?.[0]}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-navy">{employee.full_name}</h1>
            <p className="text-sm text-slate">{employee.designation?.title || "—"} · {employee.department?.name || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={employee.status} />
          {can("employees.edit") && (
            <Link to={`/employees/${id}/edit`} className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brandd transition-colors">
              <IconEdit className="w-4 h-4" /> Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-navy mb-3">Personal Information</h2>
          <Row label="Employee Code" value={employee.employee_code} />
          <Row label="Email" value={employee.email} />
          <Row label="Phone" value={employee.phone} />
          <Row label="Date of Birth" value={employee.date_of_birth} />
          <Row label="Gender" value={employee.gender} />
          <Row label="Address" value={[employee.address, employee.city, employee.country].filter(Boolean).join(", ")} />

          <h2 className="font-display font-bold text-navy mt-6 mb-3">Employment</h2>
          <Row label="Employment Type" value={employee.employment_type?.replaceAll("_", " ")} />
          <Row label="Joining Date" value={employee.joining_date} />
          <Row label="Manager" value={employee.manager?.full_name} />
          <Row label="Work Location" value={employee.work_location} />
          <Row label="Salary" value={employee.salary ? `PKR ${Number(employee.salary).toLocaleString()}` : null} />

          <h2 className="font-display font-bold text-navy mt-6 mb-3">Emergency & Bank</h2>
          <Row label="Emergency Contact" value={employee.emergency_contact_name} />
          <Row label="Emergency Phone" value={employee.emergency_contact_phone} />
          <Row label="Bank" value={employee.bank_name} />
          <Row label="Account Number" value={employee.bank_account_number} />
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 h-fit">
          <h2 className="font-display font-bold text-navy mb-4">Leave Balance ({new Date().getFullYear()})</h2>
          {balances.length ? (
            <div className="space-y-4">
              {balances.map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink/80">{b.leave_type}</span>
                    <span className="text-slate">{b.remaining_days}/{b.allocated_days} days</span>
                  </div>
                  <div className="h-1.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${b.allocated_days ? (b.used_days / b.allocated_days) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate">No leave balance records yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
