<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\LeaveRequest;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        $totalEmployees = Employee::count();
        $activeEmployees = Employee::where('status', 'active')->count();
        $inactiveEmployees = $totalEmployees - $activeEmployees;
        $newThisMonth = Employee::whereMonth('joining_date', now()->month)
            ->whereYear('joining_date', now()->year)
            ->count();

        $presentToday = Attendance::where('date', $today)
            ->whereIn('status', ['present', 'late', 'work_from_home'])
            ->count();
        $absentToday = Attendance::where('date', $today)->where('status', 'absent')->count();
        $onLeaveToday = Attendance::where('date', $today)->where('status', 'on_leave')->count();

        $pendingLeaveRequests = LeaveRequest::where('status', 'pending')->count();

        $upcomingBirthdays = Employee::whereNotNull('date_of_birth')
            ->whereRaw('DATE_FORMAT(date_of_birth, "%m-%d") BETWEEN DATE_FORMAT(NOW(), "%m-%d") AND DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 30 DAY), "%m-%d")')
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'date_of_birth']);

        $upcomingHolidays = Holiday::where('date', '>=', $today)
            ->orderBy('date')
            ->limit(5)
            ->get(['id', 'name', 'date']);

        return $this->success([
            'total_employees' => $totalEmployees,
            'active_employees' => $activeEmployees,
            'inactive_employees' => $inactiveEmployees,
            'new_employees_this_month' => $newThisMonth,
            'departments' => Department::where('is_active', true)->count(),
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'on_leave_today' => $onLeaveToday,
            'pending_leave_requests' => $pendingLeaveRequests,
            'upcoming_birthdays' => $upcomingBirthdays,
            'upcoming_holidays' => $upcomingHolidays,
        ]);
    }
}
