<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Services\AttendanceService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceService $attendanceService) {}

    public function index(Request $request)
    {
        $query = Attendance::with('employee:id,first_name,last_name,employee_code,department_id')
            ->with('employee.department:id,name');

        if ($employeeId = $request->query('employee_id')) {
            $query->where('employee_id', $employeeId);
        }
        if ($departmentId = $request->query('department_id')) {
            $query->whereHas('employee', fn ($q) => $q->where('department_id', $departmentId));
        }
        if ($date = $request->query('date')) {
            $query->where('date', $date);
        }
        if ($from = $request->query('from')) {
            $query->where('date', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->where('date', '<=', $to);
        }

        $perPage = min((int) $request->query('per_page', 30), 100);
        $records = $query->orderByDesc('date')->paginate($perPage);

        return $this->success([
            'items' => $records->items(),
            'pagination' => [
                'current_page' => $records->currentPage(),
                'total' => $records->total(),
                'last_page' => $records->lastPage(),
            ],
        ]);
    }

    public function checkIn(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'date' => ['required', 'date'],
            'check_in' => ['required', 'date_format:H:i'],
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            ['check_in' => $data['check_in'], 'status' => 'present']
        );

        return $this->success($attendance, 'Checked in successfully');
    }

    public function checkOut(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'date' => ['required', 'date'],
            'check_out' => ['required', 'date_format:H:i'],
        ]);

        $attendance = Attendance::where('employee_id', $data['employee_id'])
            ->where('date', $data['date'])
            ->firstOrFail();

        $workHours = $this->attendanceService->computeWorkHours($attendance->check_in, $data['check_out']);
        $overtime = $workHours ? $this->attendanceService->computeOvertime($workHours) : 0;

        $attendance->update([
            'check_out' => $data['check_out'],
            'work_hours' => $workHours,
            'overtime_hours' => $overtime,
        ]);

        return $this->success($attendance, 'Checked out successfully');
    }

    public function update(Request $request, Attendance $attendance)
    {
        // Manual correction by HR/Admin.
        $data = $request->validate([
            'status' => ['required', 'in:present,absent,late,half_day,work_from_home,on_leave'],
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string'],
        ]);

        if (! empty($data['check_in']) && ! empty($data['check_out'])) {
            $data['work_hours'] = $this->attendanceService->computeWorkHours($data['check_in'], $data['check_out']);
            $data['overtime_hours'] = $data['work_hours'] ? $this->attendanceService->computeOvertime($data['work_hours']) : 0;
        }

        $attendance->update($data);

        return $this->success($attendance, 'Attendance updated successfully');
    }
}
