<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query()->with(['department', 'designation', 'manager']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_code', 'like', "%{$search}%");
            });
        }

        if ($departmentId = $request->query('department_id')) {
            $query->where('department_id', $departmentId);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = $request->query('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'first_name', 'joining_date', 'salary'];
        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min((int) $request->query('per_page', 20), 100);
        $employees = $query->paginate($perPage);

        return $this->success([
            'items' => EmployeeResource::collection($employees->items()),
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'last_page' => $employees->lastPage(),
            ],
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        $data['employee_code'] = $this->generateEmployeeCode();

        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('employees', 'public');
        }

        $employee = Employee::create($data);

        ActivityLogger::log('employee.created', "Employee {$employee->full_name} created", 'Employee', $employee->id);

        return $this->success(new EmployeeResource($employee), 'Employee created successfully', 201);
    }

    public function show(Employee $employee)
    {
        $employee->load(['department', 'designation', 'manager']);

        return $this->success(new EmployeeResource($employee));
    }

    public function update(StoreEmployeeRequest $request, Employee $employee)
    {
        $data = $request->validated();

        if ($request->hasFile('profile_photo')) {
            if ($employee->profile_photo) {
                Storage::disk('public')->delete($employee->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('employees', 'public');
        }

        $employee->update($data);

        ActivityLogger::log('employee.updated', "Employee {$employee->full_name} updated", 'Employee', $employee->id);

        return $this->success(new EmployeeResource($employee), 'Employee updated successfully');
    }

    public function destroy(Employee $employee)
    {
        // Soft delete — historical attendance/leave/payroll records must stay intact.
        $employee->update(['status' => 'inactive']);
        $employee->delete();

        ActivityLogger::log('employee.deactivated', "Employee {$employee->full_name} deactivated", 'Employee', $employee->id);

        return $this->success(null, 'Employee deactivated successfully');
    }

    private function generateEmployeeCode(): string
    {
        $last = Employee::withTrashed()->orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'EMP-' . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }
}
