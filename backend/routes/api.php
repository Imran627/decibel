<?php

use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DesignationController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\HolidayController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\LeaveTypeController;
use Illuminate\Support\Facades\Route;

// ---- Public ----
Route::post('/auth/login', [AuthController::class, 'login']);

// ---- Authenticated ----
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/employees', [EmployeeController::class, 'index'])->middleware('permission:employees.view');
    Route::post('/employees', [EmployeeController::class, 'store'])->middleware('permission:employees.create');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->middleware('permission:employees.view');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employees.edit');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employees.delete');

    Route::apiResource('departments', DepartmentController::class)->except(['show']);
    Route::apiResource('designations', DesignationController::class)->except(['show']);

    Route::get('/attendance', [AttendanceController::class, 'index'])->middleware('permission:attendance.view');
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn'])->middleware('permission:attendance.manage');
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut'])->middleware('permission:attendance.manage');
    Route::put('/attendance/{attendance}', [AttendanceController::class, 'update'])->middleware('permission:attendance.manage');

    Route::apiResource('leave-types', LeaveTypeController::class)->except(['show']);
    Route::get('/leave-requests', [LeaveRequestController::class, 'index'])->middleware('permission:leaves.view');
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::post('/leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->middleware('permission:leaves.approve');
    Route::post('/leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->middleware('permission:leaves.approve');
    Route::get('/employees/{employeeId}/leave-balances', [LeaveRequestController::class, 'balances']);

    Route::apiResource('holidays', HolidayController::class)->except(['show']);
    Route::apiResource('announcements', AnnouncementController::class)->except(['show']);

    Route::prefix('admin')->middleware('permission:settings.manage')->group(function () {
        Route::apiResource('users', UserController::class)->except(['show']);
        Route::get('roles', [RoleController::class, 'index']);
        Route::get('permissions', [RoleController::class, 'permissions']);
        Route::put('roles/{role}/permissions', [RoleController::class, 'syncPermissions']);
    });
});
